# swiper插件踩坑

[Swiper结合React使用文档](https://swiperjs.com/react#installation)

## 1.配置card模式

`Swiper` 的每个特性在 `React` 中使用需要引入对应的模块，以及 `css` 文件

使用 `autoplay` 以及 `cards` 功能模块的示例：

```jsx
import { useEffect, useState } from 'react';
import { Autoplay, EffectCards } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/effect-cards";

const App = () => {
  const [slideList, setSlideList] = useState([]);
  useEffect(() => {
    setSlideList(["swiper1", "swiper2", "swiper3"]);
  }, []);
  return (
    <>
    <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards, Autoplay]}
        className="mySwiper"
        loop={true}
        autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        // onSwiper={(swiper) =>
        //   console.log(swiper, swiper.activeIndex, swiper.realIndex)
        // }
        // initialSlide={1}
      >
        {/* {slideList.length > 0 &&
          slideList.map((item, index) => {
            return <SwiperSlide key={index}>{item}</SwiperSlide>;
          })} */}
      </Swiper>
    </>
  )
}
```

### 问题1

无法复制轮播图里面的文字内容

#### 解决方法1

```js
...
allowTouchMove={false}
...
```

通过禁用 `touchMove` 事件，解决了不能复制文字的问题，但是无法通过拖拽换页，只能通过点击 `navigation` 箭头进行换页

#### 解决方法2

```js
...
noSwiping={true} // 设置不可拖动文字区域样式
...

<h1 className={`${styles.title} swiper-no-swiping`}>This is a Title.</h1>
```

通过配置 `noSwiping` 属性，并在对应文字内容添加 `swiper-no-swiping` 样式，即可禁用拖拽效果，实现文字的复制。同时不禁用轮播模块其他部分的拖拽效果。

### 问题2

在 `loop` 模式下，展示的第一张 `slide` 实际上是最后一张而不是第一张。

#### 解决方案

配置 `initialSlide={1}`

#### 原因

`loop` 模式的原理就是在 `Swiper` 初始化时，会复制第一个和最后一个`slide`置于尾部和头部。也就是说初始化时当前展示的第一个 `slide` 实际上是 `activeIndex` 为 `1` 的那个，而不是 `activeIndex` 为 `0` 的那个。

1. 静态渲染，即在渲染的时候已经有静态的 `slideSide` 数据。`swiper` 初始化时，会把 `activeIndex` 设置为 `1`，这样展示的就是第一个 `slide`
2. 还有一种情况是异步渲染，即在初始化 `swiper` 组件时，由于没有 `slideSide` 数据， `activeIndex` 会被设置成 `0`。当获取到数据后，`activeIndex` 仍然为 `0`。所以需要手动设置 `activeIndex` 为 `1`。即添加 `initialSlide={1}` 属性

## 2.双向控制轮播图，swiper1轮播控制swiper2，同时swiper2要有渐显效果

需要引入 `Controller` `EffectFade` 模块，代码如下

```js

import { useEffect, useState } from 'react';
import { Autoplay, Navigation, Controller, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HomeStories = ({ data }) => {
  const [swiperI, setSwiperI] = useState(null);
  const [storyList, setStoryList] = useState([]);
  useEffect(() => {
    if (data) {
      setStoryList(data.contentList);
    }
  }, [data]);
  return (
    <div className={styles.storyBox}>
      <div className={styles.backgroundBox}>
        {storyList.length > 0 && (
          <div className={styles.swiperContainer}>
            <div className={styles.pictureSwiperBox}>
              <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                // initialSlide={1}
                loop={true}
                navigation={true}
                modules={[Autoplay, Navigation, Controller]}
                className={styles.swiperImage}
                controller={{ control: swiperI }}
              >
                {storyList?.length > 0 &&
                  storyList.map((item, index) => {
                    return (
                      <SwiperSlide key={index} className={styles.swiperSlide}>
                        <img src={item.contentMedium} alt='image' />
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>

            <div className={styles.textSwiperBox}>
              <Swiper
                spaceBetween={30}
                onSwiper={setSwiperI}
                style={{
                  '--swiper-navigation-color': '#101828',
                }}
                centeredSlides={true}
                pagination={{
                  clickable: true,
                }}
                noSwiping={true} // 设置不可拖动文字区域样式
                loop={true}
                effect='fade'
                fadeEffect={{
                  crossFade: true,
                }}
                initialSlide={1}
                // navigation={true}
                modules={[Autoplay, Navigation, EffectFade]}
              >
                {storyList?.length > 0 &&
                  storyList.map((item, index) => (
                    <SwiperSlide className={styles.textSwiperSlide} key={index}>
                      <div className={styles.textBox}>
                        <h1 className='swiper-no-swiping'>{item.contentTitle}</h1>
                        <p className='swiper-no-swiping'>{item.contentSummary}</p>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeStories;
```

注意点：

1. 要引入对应的样式文件 `import 'swiper/css/effect-fade'`
2. `swiper2` `fadeEffect` 属性 要设置为 `crossFade: true`，否则会产生文字重叠
3. 需要用 `useState` 提供的 `setSwiperI` 拿到 `swiper2` 的实例，需要用到 `onSwiper` 回调函数
4. 因为设置了 `loop` 模式，且 `slide` 数据为异步获取，所以默认展示的 `slide` 是 `index` 为 `0` 的最后一个。这不是我们想要的，按照之前的解决方法设置 `initialSlide={1}` 却没有生效。最后的解决方法是，只有在拿到 slide 的数据后才进行 `Swiper` 组件的初始化，见上述代码。
