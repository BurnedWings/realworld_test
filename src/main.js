import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css' //引用bootstrap的样式
import {Icon,Form,FormItem,Input,Button,Select,Option,Message,Card,Row,Col,Tag,Drawer,Loading,Menu,MenuItem,Submenu,MenuItemGroup,Radio,RadioGroup,DatePicker,Dialog,MessageBox,Popover,Skeleton,SkeletonItem,Backtop,Pagination,Upload,Tooltip,Popconfirm,Image} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

//挂载$API
import API from '@/api/index'
Vue.prototype.$API=API
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
Vue.prototype.$dayjs=dayjs

Vue.use(Icon).use(Form).use(FormItem).use(Input).use(Button).use(Select).use(Option)
.use(Card).use(Row).use(Col).use(Tag).use(Drawer).use(Loading).use(Menu).use(MenuItem)
.use(Submenu).use(MenuItemGroup).use(Radio).use(RadioGroup).use(DatePicker).use(Dialog)
.use(Popover).use(Skeleton).use(SkeletonItem).use(Backtop).use(Pagination).use(Upload)
.use(Tooltip).use(Popconfirm).use(Image)


new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus = this
}
}).$mount('#app')
