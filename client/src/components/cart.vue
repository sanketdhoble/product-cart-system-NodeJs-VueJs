<template>
  <div class="row cart">
    <div class="col-sm-12">
      <router-link class="btn btn-primary pull-right" :to="'/'">Go To Products</router-link>
    </div>
    <div class="col-sm-7">
      <div class="col-sm-12" v-for="prod in products"  style="border:1px solid lightgrey;margin-bottom: 15px">
        <div class="col-sm-5" style="border-right:1px solid lightgrey">
          <div class="boxWrapper">
            <div class="proContainer">
              <div class="imgCard">
                <div class="imgWrapper">
                  <div class="testImage">
                    <div class="testWrapper">
                      <img :src="prod.url" width="100%" height="100%">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-7" style="margin-top:99px;">
          <div class="boxStatusList">
            <div class="boxStatus">
              <b class="text-capitalize">{{prod.title}}</b>
            </div>
            <div class="boxStatus">
              <p><span class="description"> {{prod.description}}</span></p>
            </div>
            <div class="boxStatus">
              <p> &#8377; {{prod.price}}</p>
            </div>
            <div class="boxStatus">
              <p>Quantity - {{prod.quantity}}</p>
            </div>
            <div class="boxStatus">
              <button class="btn btn-default" @click="removeItem(prod)">remove</button>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="col-sm-5" style="margin-top: 155px" v-if="!emptyCart">
        <h2>Total-{{total}}</h2>
    </div>
    <div class="col-sm-12" style="margin-top: 155px">
      <h1 v-if="emptyCart">Your Cart is Empty</h1>
    </div>
  </div>

</template>

<script>
import PostsService from '@/services/PostsService'
export default {
  name: 'cart',
  data () {
    return {
      title: '',
      description: '',
      products: [],
      product: {},
      emptyCart: false,
      total: 0
    }
  },
  mounted () {
    this.getCartProducts()
  },
  methods: {
    async getCartProducts () {
      try {
        const response = await PostsService.getCartProducts(localStorage.userId)
        this.products = response.data.products
        if (this.products.length === 0) {
          this.emptyCart = true
        }
        this.total = 0
        for (var i = 0; i < this.products.length; i++) {
          this.total = this.total + this.products[i].price * this.products[i].quantity
        }
//        this.$swal(
//          'Great!',
//          `checkout is successful`,
//          'success'
//        )
      } catch (e) {
        console.log(e)
      }
//      this.$router.push({ name: 'products' })
    },
    async removeItem (product) {
      try {
        await PostsService.removeFromCart(product._id)
        this.getCartProducts()
        $.notify('Product is removed from Cart', 'success')
      } catch (e) {
        console.log(e)
        alert('error occured')
      }
    }
  }
}
</script>
<style type="text/css">
.form input, .form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.app_post_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
  .row{
    margin:0px;
  }
</style>

