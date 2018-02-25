<template>

     <div class="row">
       <div class="col-sm-12">
         <div class="col-sm-8">
            <span><h4>Welcome {{username}} - <a href="#" @click="logout">Logout</a></h4></span>
         </div>
         <div class="col-sm-4">
           <router-link class="btn btn-primary pull-right" :to="'/cart'">Go To Cart</router-link>
         </div>
       </div>
       <div class="col-sm-12">
          <div class="col-sm-3" v-for="prod in products">
            <a href="" @click="getProduct(prod)" data-toggle="modal" data-target="#myModal">
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
                <div class="boxStatusList">
                  <div class="boxStatus">
                    <b class="text-capitalize">{{prod.title}}</b>
                  </div>
                  <div class="boxStatus">
                    <p><span class="description"> {{prod.description}}</span></p>
                  </div>
                  <div class="boxStatus">
                    <p> &#8377; {{prod.price}} &nbsp;&nbsp;
                      <span v-if="prod.quantity>0" class="green">
                        InStock({{prod.quantity}})
                      </span>
                      <span class="red" v-else>
                        OutOfStock({{prod.quantity}})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>

      </div>

        <!--<ProductModal :show="modalOpen" :brandRowObj="url" @close="initModalOnClose"></ProductModal>-->
        <!--MODAL-->
        <div class="modal fade" id="myModal" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" @click="initModal()"  data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Product Cart</h4>
            </div>
            <div class="modal-body">
              <div class="row">
                  <div class="col-sm-12">
                    <div class="col-sm-5">
                      <div class="boxWrapper">
                        <div class="proContainer">
                          <div class="imgCard">
                            <div class="imgWrapper">
                              <div class="testImage">
                                <div class="testWrapper">
                                  <img :src="url" width="100%" height="100%">
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-7" style="margin-top:99px">
                      <div class="boxStatusList">
                        <div class="boxStatus">
                          <b class="text-capitalize">{{title}}</b>
                        </div>
                        <div class="boxStatus">
                          <p><span class="description"> {{description}}</span></p>
                        </div>
                        <div class="boxStatus">
                          <p> &#8377; {{price}}</p>
                        </div>
                        <div class="boxStatus">
                          <div class="dropdown pull-left">
                            <button class="btn btn-primary dropdown-toggle" type="button"  data-toggle="dropdown">{{quantitySelected==''?'quantity':quantitySelected}}
                              <span class="caret"></span></button>
                            <ul class="dropdown-menu" v-if="quantity>=5">
                                <li v-for="n in 5"><a  @click="quantitySelected=n" href="#">{{n}}</a></li>
                            </ul>
                            <ul class="dropdown-menu" v-else>
                                <li v-for="n in quantity"><a  @click="quantitySelected=n" href="#">{{n}}</a></li>
                            </ul>
                          </div>
                          <button class="btn pull-right btn-success" @click="addToCart(product)">Add To Cart</button>
                        </div>
                      </div>

                    </div>
                  </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" @click="initModal()" data-dismiss="modal">Close</button>
            </div>
        </div>
      </div>
    </div>

     </div>




</template>

<script>
  import PostsService from '../services/PostsService'
//  import ProductModal from './modals/ProductModal.ejs'

  export default {
    name: 'products',
    components: {
//      ProductModal: ProductModal
    },
    data () {
      return {
        title: '',
        description: '',
        price: '',
        quantity: '',
        quantitySelected: '',
        url: '',
        username: localStorage.userName,
        products: [],
        product: {}
      }
    },
    mounted () {
      this.getProducts()
    },
    methods: {
      async getProducts () {
        try {
          const response = await PostsService.fetchProducts()
          this.products = response.data.products
          console.log(this.products)
        } catch (e) {
          $.notify(e.response.data.message, 'danger')
        }
      },
      getProduct (product) {
        this.quantity = product.quantity
        this.product = product
        this.url = product.url
        this.title = product.title
        this.description = product.description
        this.price = product.price
      },
      initModal (product) {
        this.description = ''
        this.quantitySelected = ''
        this.quantity = ''
        this.size = ''
        this.price = ''
        this.url = ''
        this.title = ''
      },
      async addToCart (data) {
        try {
          var obj = {
            url: data.url,
            description: data.description,
            title: data.title,
            quantity: this.quantitySelected,
            price: data.price,
            productId: data.productId,
            userId: localStorage.userId
          }
          if (this.quantitySelected === '') {
            alert('Please select quantity')
            return
          }
          const response = await PostsService.addToCart(obj)
          console.log('Add To Cart', response)
          this.getProducts()
          $.notify('Product Added to Cart Successfully', 'success')
          this.initModal()
          $('#myModal').modal('hide')
        } catch (e) {
          console.log(e.response.data.message)
          $.notify(e.response.data.message, 'danger')
        }
      },
      async logout () {
        try {
          await PostsService.logout()
          delete localStorage.session
          this.$router.push({ name: 'login' })
        } catch (e) {
          $.notify(e.response.data.message, 'danger')
        }
      }
    }
  }
</script>
<style type="text/css">

  .testImage {
    width: 100%;
    padding-top: 100%;
    position: relative;
  }

  .testWrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center
  }

  .testWrapper img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    margin: auto
  }

  .proContainer {
    position: relative;
    width: 100%;
    padding-top: 100%;
  }

  .imgCard {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }

  .imgWrapper img, .images img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .boxWrapper {
    margin-bottom: 10px;
    background: #fff;
    border: 1px solid #E6E9ED;
    padding-top: 15px;
    position: relative;
    height: 100%;
  }

  .boxStatusList {
    display: flex;
    flex-direction: column;
    /*height: 40px;*/
    align-content: center;
  }

  .boxStatus {
    flex: 1;
    /* flex-wrap: nowrap; */
    /* justify-content: center; */
    /* flex-flow: row wrap; */
    justify-content: space-around;
    align-items: center
  }


  .description {
    color:slategrey
  }
  .row a{
    text-decoration: none;
  }

  .row{
    margin:0px;
    margin-top: -20px;
  }
  .dropdown-menu{
    min-width: 88px !important;
  }

  .green{
    color: green
  }
  .red{
    color:red
  }
</style>

