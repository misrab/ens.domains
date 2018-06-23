import React from 'react'
import styled from 'react-emotion'
import mq from '../../mediaQuery'
import { modulate } from '../../utils'

const Supported = styled('section')`
  position: relative;
  padding: 100px 0;

  ${mq.medium`
    padding: 170px 0;
  `};

  .bg-images img {
    position: absolute;
  }

  .hexagon1 {
    left: 50%;
    top: 0;
    transform: translateX(-50%)
  }

  .hexagon2 {
    right: 0;
    top: 50%;
  }

  .circle1 {
    left: 0;
    top: 75%;
  }

  .circle2 {
    right: 0;
    top: 120%;
  }

  .hexagon3 {
    left: 0;
    top: 150%;
  }

  background-image: linear-gradient(
    -179deg,
    rgba(138, 244, 255, 0.1) 0%,
    rgba(21, 94, 240, 0.1) 100%
  );
  h2 {
    margin-bottom: 100px;
  }
  .apps {
    display: flex;
    justify-content: space-between;
    margin: 0 auto 50px;
    width: 100%;
    flex-wrap: wrap;

    &:last-of-type {
      margin 0 auto 0;
    }

    ${mq.medium`
      width: 80%%;
    `};
  }

  h3 {
    text-align: center;
    font-size: 30px;
    margin-bottom: 60px;
  }

  .app {
    text-align: center;
    width: 50%;
    ${mq.medium`
      width: 25%;
    `};
    img {
      width: 50%;
      margin-bottom: 15px;
    }
    p {
      color: #3252C8;
      font-size: 16px;
      font-weight: 400;
      text-transform: capitalize;
      ${mq.medium`
        font-size: 20px;
      `};
    }
  }
`

const importAll = r =>
  r.keys().map(item => {
    let parsed = item
      .replace(/\.(png|jpe?g|svg)$/, '')
      .replace(/([A-Z])/g, ' $1')
      .replace('./', '')
    return {
      name: parsed,
      src: r(item),
    }
  })

const mobile = importAll(
  require.context('./mobile', false, /\.(png|jpe?g|svg)$/)
)
const desktop = importAll(
  require.context('./desktop', false, /\.(png|jpe?g|svg)$/)
)
const apps = importAll(require.context('./apps', false, /\.(png|jpe?g|svg)$/))

const bgImages = importAll(
  require.context('./images', false, /\.(png|jpe?g|svg)$/)
)

const AppRow = ({ list, className, title }) => {
  return (
    <React.Fragment>
      <h3>{title}</h3>
      <div className={`apps ${className ? className : ''}`}>
        {list.map(item => (
          <App key={item.name} src={item.src} name={item.name} />
        ))}
      </div>
    </React.Fragment>
  )
}

const App = ({ src, name }) => (
  <div className="app">
    <img src={src} />
    <p>{name}</p>
  </div>
)

export default class SuppportedContainer extends React.Component {
  constructor(props) {
    super(props)
    this.supported = React.createRef()
    this.hexagon1 = React.createRef()
    this.hexagon2 = React.createRef()
    this.hexagon3 = React.createRef()
    this.circle1 = React.createRef()
    this.circle2 = React.createRef()
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  handleScroll = () => {
    let bodyHeight = document.body.clientHeight
    let supported = this.supported.current
    let supportedHeight = supported.offsetHeight
    let roadmap = document.querySelector('.roadmap')
    let roadMapHeight = supported.offsetHeight
    let supportedTop = supported.offsetTop - bodyHeight
    let roadMapOffsetBottom = roadmap.offsetTop + roadMapHeight

    let scrollRange1 = [supportedTop, roadMapOffsetBottom]
    let scrollRange2 = [supportedTop + supportedHeight / 2, roadMapOffsetBottom]

    const hexagon1Pos = modulate(
      window.pageYOffset,
      scrollRange1,
      [-200, supportedHeight / 2],
      true
    )

    const hexagon2Pos = modulate(
      window.pageYOffset,
      scrollRange2,
      [80, 40],
      true
    )

    const circle1pos = modulate(
      window.pageYOffset,
      scrollRange2,
      [75, 100],
      true
    )

    const circle2pos = modulate(
      window.pageYOffset,
      scrollRange1,
      [100, 140],
      true
    )

    const hexagon3Pos = modulate(
      window.pageYOffset,
      scrollRange1,
      [150, 120],
      true
    )

    this.hexagon1.current.style.top = hexagon1Pos + 'px'
    this.hexagon2.current.style.top = hexagon2Pos + '%'
    this.circle1.current.style.top = circle1pos + '%'
    this.circle2.current.style.top = circle2pos + '%'
    this.hexagon3.current.style.top = hexagon3Pos + '%'
  }

  render() {
    return (
      <Supported innerRef={this.supported}>
        <div className="bg-images">
          {bgImages.map(img => (
            <img className={img.name} src={img.src} ref={this[img.name]} />
          ))}
        </div>
        <div className="container">
          <h2>Apps Supporting ENS</h2>
          <AppRow list={mobile} title="· Mobile Wallets ·" />
          <AppRow list={desktop} title="· Desktop Wallets ·" />
          <AppRow list={apps} title="· Apps ·" />
        </div>
      </Supported>
    )
  }
}
