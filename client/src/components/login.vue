<template>
  <div class="row cart">
    <div class="col-sm-12">
      <div class="col-sm-6 col-sm-offset-3 well mar_top30 login_box_style" v-if="!showReg" >

			<span style="text-align: center">
				<h3>Login</h3>
			</span>
        <form class="form-horizontal" v-on:submit.prevent="onLogin">
          <div class="form-group">
            <label class="control-label col-sm-2">Username:</label>
            <div class="col-sm-7">
              <input type="text" v-model="uname" class="form-control" placeholder="Username">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Password:</label>
            <div class="col-sm-7">
              <input type="password" v-model="pass" class="form-control" placeholder="Enter password">
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-2">
              <button type="submit" data-dismiss="modal"  class="btn btn-default">Submit</button>
            </div>
            <div class="col-sm-4 login_reg_style">
              <b><a href="" class="red" @click.prevent="showReg=true">Register</a></b>
            </div>
          </div>
        </form>
      </div>
      <div class="col-sm-6 col-sm-offset-3 well mar_top30 login_box_style" v-if="showReg">
			<span style="text-align: center">
			<h2>Register</h2>
			</span>
        <form class="form-horizontal" v-on:submit.prevent="onRegistration">
          <div class="form-group">
            <label class="control-label col-sm-2">Username:</label>
            <div class="col-sm-10">
              <input type="text" v-model="username" class="form-control" placeholder="Username">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Email:</label>
            <div class="col-sm-10">
              <input type="email" v-model="email" class="form-control" placeholder="Unique Email Address">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">Password:</label>
            <div class="col-sm-10">
              <input type="password" v-model="password" class="form-control" placeholder="Enter password">
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-2">
              <button type="submit" data-dismiss="modal" class="btn btn-default">Submit</button>
            </div>
            <div class="col-sm-4 login_reg_style">
              <span ><b><a href="" class="red"  @click.prevent="showReg=false" >Login</a></b></span>
            </div>
          </div>
        </form>

      </div>

    </div>
  </div>

</template>

<script>
  import PostsService from '@/services/PostsService'
  export default {
    name: 'login',
    data () {
      return {
        pass: '',
        uname: '',
        email: '',
        username: '',
        password: '',
        userId: 'ca799c6b55f310b96d8da7fe',
        showReg: false
      }
    },
    mounted () {

    },
    methods: {
      async onLogin () {
        try {
          var data = {
            username: this.uname,
            password: this.pass
          }
          const response = await PostsService.authenticate(data)
          localStorage.session = response.data.session
          localStorage.userId = response.data.data.userId
          localStorage.userName = response.data.data.username
          $.notify('Login Successful', 'success')
          this.$router.push({ name: 'products' })
        } catch (e) {
          $.notify(e.response.data.message, 'danger')
        }
      },
      async onRegistration (product) {
        try {
          var data = {
            username: this.username,
            password: this.password,
            email: this.email
          }
          await PostsService.registration(data)
          this.$swal(
            'Great!',
            `Registration successful`,
            'success'
          )
          this.showReg = false
        } catch (e) {
          $.notify(e.response.data.message, 'danger')
        }
      }
    }
  }
</script>
<style type="text/css">

  .row{
    margin:0px;
  }
  .red{
    color:red
  }
</style>

