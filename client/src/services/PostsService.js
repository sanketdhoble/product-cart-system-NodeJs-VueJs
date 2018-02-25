import Api from '@/services/Api'

export default {
  fetchProducts () {
    return Api().get('products?token=' + localStorage.session)
  },
  addToCart (data) {
    return Api().post('addtocart?token=' + localStorage.session, data)
  },
  getCartProducts (userId) {
    return Api().get('cart/' + userId + '?token=' + localStorage.session)
  },
  removeFromCart (productId) {
    return Api().delete('cart/removeproduct/' + productId + '?token=' + localStorage.session)
  },
  authenticate (data) {
    return Api().post('authenticate?token=' + localStorage.session, data)
  },
  registration (data) {
    return Api().post('register?token=' + localStorage.session, data)
  },
  logout () {
    return Api().get('logout')
  }
}
