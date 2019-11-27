module.exports = {
  title: '小白龙的博客',  // title
  description: '小白龙的前端记录', // meta description
  dest: '/dist',
  head: [
    ['link', 
      { rel: 'icon', href: '/egg.png' }
      //浏览器的标签栏的网页图标，第一个'/'会遍历public文件夹的文件
      ],  
    ],
  // serviceWorker: true,
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@': '/',
  //     }
  //   }
  // },
  // 主题配置
  themeConfig: {
    logo: '/egg.png', // 网页顶端导航栏左上角的图标
    //顶部导航栏
    nav: [
      // 顶部跳转链接
      {
        text: '首页',
        link: '/'
      },
      // 外部链接
      { 
        text: 'Github', 
        link: 'https://github.com/xblcity' 
      },
    ],
    //侧边导航栏：会根据当前的文件路径是否匹配侧边栏数据，自动显示/隐藏
    sidebar:{
      // '/': [
      //   {
      //     title: 'JS基础',   // 一级菜单名称
      //     collapsable: false, // false为默认展开菜单, 默认值true是折叠,
      //     path: '@/.vuepress/README',
      //   },
      // ],
      '/js/': [
        {
          title: 'JS基础',   // 一级菜单名称
          collapsable: false, // false为默认展开菜单, 默认值true是折叠,
          // path: '/js/',
          children: [
            'closures-scope',
            'this',
            'constructor',
            'inherit',
            'object-methods',
          ]
        },
      ],
    }
  }
}