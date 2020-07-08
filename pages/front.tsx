import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import { Footer } from '../components'
import { useBreakPoint } from '../hooks'
import { BallPhysics } from '../my_apps'
import * as _sortBy from 'lodash/sortBy'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/dist/TextPlugin'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Container, Row, Col, Modal, Spinner } from 'react-bootstrap'
import CountUp from 'react-countup'
import {
  FaAlignJustify,
  FaTimes,
  FaQuestionCircle,
  FaDesktop,
  FaBoxOpen,
  FaGithub,
  FaCubes,
  FaNpm,
  FaServer,
  FaPalette,
  FaChrome,
  FaRocket,
  FaPlug,
  FaDatabase,
  FaWrench,
  FaUserCog,
  FaNetworkWired,
  FaTachometerAlt,
  FaLock,
  FaSmile,
  FaSmileWink,
} from 'react-icons/fa'

// typings declaration
type Tdata = {
  modalData: {
    src: string | undefined
    title: string | undefined
    header: string | undefined
    body: string | undefined
  }
}

export const Front = ({ post }): JSX.Element => {
  // ref for div that wraps around the bottom right section of front page
  let frontRightBottomRef: HTMLElement

  //sider icons object
  const siderLinks = [
    {
      IDE: <FaDesktop />,
      Containers: <FaBoxOpen />,
      Git: <FaGithub />,
      Stack: <FaCubes />,
      npm: <FaNpm />,
      Hosting: <FaRocket />,
    },
    {
      Design: <FaPalette />,
      'Front-end': <FaChrome />,
      Microservices: <FaServer />,
      API: <FaPlug />,
      Database: <FaDatabase />,
    },
    {
      Functionality: <FaWrench />,
      Usability: <FaUserCog />,
      Interface: <FaNetworkWired />,
      Performance: <FaTachometerAlt />,
      Security: <FaLock />,
    },
  ]

  // instantiate gsap
  gsap.registerPlugin(TextPlugin, ScrollTrigger)
  const tl_landing = gsap.timeline()
  const tl_textVid = gsap.timeline()

  //instantiate useBreakPoint hook
  const [currentViewport, currentViewportSize] = useBreakPoint()

  //----all useState hooks below
  //controls state of sider in small media
  const [siderState, setsiderState] = useState(false)
  const [siderShowHideIcon, setsiderShowHideIcon] = useState(<FaAlignJustify />)
  //controls the loading transition and intro animation state false for ongoing true for done
  const [landingTransition, setlandingTransition] = useState(true)
  //controls modal popup
  const [modalShow, setmodalShow] = useState(false)
  const [modalContent, setmodalContent] = useState<Tdata['modalData']>({
    src: undefined,
    title: undefined,
    header: undefined,
    body: undefined,
  })
  //controls iframes loading status
  const [iframeStatus, setiframeStatus] = useState(
    <Spinner animation="border" role="status" variant="primary" />
  )
  //control what is showing in the main text section when try somthing cool is clicked
  const [testStage, settestStage] = useState(false)
  //triggered when bottom right section is active
  const [showBottomRight, setshowBottomRight] = useState(false)
  //controls skills bar animation
  const [skillsBarAnimator, setskillsBarAnimator] = useState()
  // stores visitor location 
  const [vistorLocation, setvistorLocation] = useState<string>()

  // function to get visitors location and ISP
  const getVistorLocation = async () => {
    await fetch('http://ip-api.com/json')
    .then( res => res.json())
    .then(data => {
      setvistorLocation(data.country + " - " + data.isp)
    })
    .catch(() => {
      setvistorLocation('Request failed');
    })
  }
  //function to handle theme changer on click of a theme
  const themeChanger = (event: any) => {
    const themeProvider = document.querySelector('.theme-provider')
    themeProvider.className = `theme-provider theme-${event.target.innerText.toLowerCase()}`
  }

  //function to handle modal iframe content displayed
  const modalIframeHandler = (arg: Tdata['modalData']) => {
    setmodalContent(arg)
    setmodalShow(true)
  }

  //function to help determine how to display the skills progress bar takes
  //two argument 1. type of output required 2. the level of achievement as a number
  //this function is mainly called by data coming in from getstaticprops
  const skillsLevelBarHelper = (
    arg_1: 'color' | 'description',
    arg_2: number
  ) => {
    if (arg_1 === 'color') {
      return arg_2 >= 75
        ? 'bg-success'
        : arg_2 >= 50
        ? 'bg-info'
        : arg_2 >= 25
        ? 'bg-warning'
        : 'bg-danger'
    }
    if (arg_1 === 'description') {
      return arg_2 >= 75
        ? 'Expert'
        : arg_2 >= 50
        ? 'Advance'
        : arg_2 >= 25
        ? 'Intermediate'
        : 'Beginer'
    }
  }

  //scroll gsap activity class with helper functions
  const scrollHelper = {
    //returns the inner width of a div by taking the class name as argument
    parentWidth: (arg: string): number => {
      return (document.querySelector(arg) as HTMLElement)?.offsetWidth / 2
    },
  }

  // useEffect for other activities on page other than gsap
  useEffect(() => {
    siderState
      ? setsiderShowHideIcon(<FaTimes />)
      : setsiderShowHideIcon(<FaAlignJustify />)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [siderState])

  //useEffect for controlling the click to test something cool canvas
  useEffect(() => {
    getVistorLocation()
    BallPhysics("test-stage-window")

  }, [testStage])

  //useEffect for controlling component in viewport behaviour
  useEffect(() => {
    const inViewBottomRight = gsap.utils.toArray(".skills-row");
    inViewBottomRight?.map((e,i) => 
        gsap.fromTo(
            e as HTMLElement,
            { xPercent: 7.5, opacity: 0.25 },
            {
                scrollTrigger: {
                trigger: e as HTMLElement,
                // markers: true,
                start: 'top 90%',
                toggleActions: 'restart none none reverse',
                },
                duration: 1,
                opacity: 1,
                xPercent: 0,
                onStart: i === 0 ? setskillsBarAnimator : null,
                onStartParams: [false],
                onComplete: i === 0 ? setskillsBarAnimator : null,
                onCompleteParams: [true],
                onReverseComplete: i === 0 ? setskillsBarAnimator : null,
                onReverseCompleteParams: [false],
            }
        )
    )
  }, [showBottomRight, currentViewportSize])

  // gsap scrolltrigger config
  useEffect(() => {
    // instantiate timeline for scroll animation of main-languages and main-numbers
    const tl_scrollViews = gsap.timeline({
      scrollTrigger: {
        trigger: '.grad-hr',
        scrub: 3,
        start: 'top top',
        end: '+=450',
        toggleActions: 'restart complete reverse reverse',
      },
    })
    tl_scrollViews
      .fromTo(
        '.main-languages-wrapper',
        { x: 0 },
        {
          duration: 1,
          x: scrollHelper.parentWidth('.front-page-right'),
          stagger: -0.025,
        }
      )
      .fromTo(
        '.main-numbers-col',
        { yPercent: 0 },
        { duration: 0.05, yPercent: -100 },
        '-=1'
      )
      .fromTo(
        '.main-languages-header, .main-numbers-header',
        { opacity: 1 },
        { duration: 0.05, opacity: 0 },
        '-=1'
      )
      .fromTo(
        '.main-languages-text',
        { opacity: 0 },
        { duration: 1, opacity: 1 },
        '-=0.5'
      )
  }, [landingTransition, currentViewportSize])

  // gsap text video
  useEffect(() => {
    !landingTransition
      ? tl_textVid
          .to('.grad-hr', { duration: 1, width: '100%' }, '+=2.5')
          .to(
            '.main-text-row',
            {
              duration: 0.5,
              height: '350px',
              width: '100%',
              paddingTop: '10px',
            },
            '-=1'
          )
          .to('.current-col, .theme-col', { duration: 1, opacity: 1 }, '-=0.5')
          .from(
            '.current-col-items, .theme-col-items',
            { duration: 0.75, opacity: 0, y: -20, stagger: 0.25 },
            '-=1'
          )
          .set('.main-languages-numbers', { display: 'flex' })
          .to(
            '.main-languages-header , .main-numbers-header',
            { duration: 1, opacity: 1 },
            '-=0.75'
          )
          .from(
            '.main-numbers-wrapper',
            { duration: 1.5, opacity: 0, y: 100 },
            '-=1'
          )
          .from(
            '.main-languages-wrapper',
            {
              duration: 1,
              opacity: 0,
              x: -500,
              stagger: 0.125,
              ease: 'elastic.out(1,0.30)',
            },
            '-=1'
          )
          .from(
            '.main-languages-header, .main-numbers-header',
            { duration: 1, y: -20 },
            '-=1'
          )
          .set('.main-text-1', { width: '100%', height: '100%' }, '-=1')
          //set rest of page display to block at thispoint
          .set('.t-01', {
            y: '-500%',
            display: 'inline',
            fontSize: '1rem',
            opacity: 0,
            onComplete: setshowBottomRight,
            onCompleteParams: [true],
          })
          // .to('.t-01', {
          //   duration: 1,
          //   y: '0%',
          //   fontSize: '3rem',
          //   opacity: 1,
          //   ease: 'bounce.out',
          // })
          // .to('.t-01', {
          //   duration: 0.25,
          //   transform: 'rotate(15deg)',
          //   ease: 'elastic.out(1,0.30)',
          // })
          // .to('.t-01', {
          //   duration: 0.25,
          //   transform: 'rotate(-15deg)',
          //   ease: 'elastic.out(1,0.30)',
          // })
          // .set('.t-01', { display: 'none' })
          // .set('.t-02', { display: 'inline', fontSize: '3rem', y: '0%' })
          // .set('.t-02', { display: 'none' }, '+=0.5')
          // .to('.t-01', { display: 'inline' })
          // .to(
          //   '.t-01',
          //   {
          //     duration: 1,
          //     transform: 'rotate(-90deg)',
          //     x: '-500%',
          //     opacity: 0,
          //     ease: 'expo.out',
          //   },
          //   '-=0.25'
          // )
          // .set('.t-01', { display: 'none' })
          // .set('.main-text-1', {
          //   width: '0%',
          //   height: '0%',
          //   borderBottom: 'solid 5px',
          // })
          // .to('.main-text-1', { duration: 0.5, width: '10%', opacity: 0.5 })
          // .to('.main-text-1', {
          //   duration: 0.5,
          //   transform: 'rotate(-90deg)',
          //   opacity: 0.75,
          // })
          // .to('.main-text-1', {
          //   duration: 1,
          //   width: '15%',
          //   borderBottom: 'solid 7.5px',
          //   opacity: 1,
          // })
          // .set('.t-03', { display: 'inline' })
          // .fromTo(
          //   '.t-03',
          //   { x: '-150%', opacity: 0 },
          //   {
          //     duration: 2,
          //     x: '0%',
          //     opacity: 1,
          //     text: { value: 'hello', delimiter: ' ' },
          //     ease: 'bounce.out',
          //   }
          // )
          // .to('.main-text-1, .main-text-2, .main-text-3', { x: '-20%' }, '-=2')
          // .fromTo(
          //   '.t-03',
          //   { x: '-150%', opacity: 0 },
          //   {
          //     x: '0%',
          //     opacity: 1,
          //     text: {
          //       value:
          //         "<span style='font-size: 2vmax'>&nbsp&nbsp i am</span></br> <span style='font-size: 4vmax; color: #40a9ff' >Owusu</span>",
          //     },
          //     ease: 'none',
          //   },
          //   '+=1'
          // )
          // .to('.main-text-1, .t-03', { duration: 2.5, opacity: 0 })
          // .set('.main-text-1, .main-text-2, .main-text-3', {
          //   border: 'none',
          //   width: 'auto',
          //   height: 'auto',
          //   opacity: 1,
          //   x: 0,
          //   y: 0,
          // })
          // .set('.main-text-2', { opacity: 1, width: '100%', height: '100%' })
          // .to('.t-04', {
          //   duration: 0.5,
          //   opacity: 1,
          //   position: 'absolute',
          //   display: 'inline',
          //   fontWeight: 'bold',
          //   fontSize: '4vmax',
          //   top: 0,
          //   color: 'white',
          //   ease: 'elastic.out(1,0.30)',
          // })
          // .to('.t-04', { duration: 0.5, fontSize: '2vmax' })
          // .to(
          //   '.main-text-heart',
          //   { duration: 2, rotationY: 360, repeat: -1 },
          //   '-=0.5'
          // )
          // .to('.t-05', {
          //   duration: 0.5,
          //   opacity: 1,
          //   position: 'absolute',
          //   display: 'inline',
          //   fontWeight: 'bolder',
          //   fontSize: '6vmax',
          //   top: '10%',
          //   color: '#39FF14',
          // })
          // .to('.t-05', {
          //   rotation: 90,
          //   top: '50%',
          //   fontSize: '4vmax',
          //   ease: 'bounce.out',
          // })
          // .to('.t-06', {
          //   duration: 0.5,
          //   opacity: 1,
          //   position: 'absolute',
          //   display: 'inline',
          //   fontWeight: 'bolder',
          //   fontSize: '6vmax',
          //   top: '20%',
          //   left: '7.5%',
          //   color: '#FE4164',
          //   ease: 'back.out(4)',
          // })
          // .to('.t-07', {
          //   duration: 0.5,
          //   opacity: 1,
          //   position: 'absolute',
          //   display: 'inline',
          //   fontWeight: 'bolder',
          //   fontSize: '3vmax',
          //   top: '45%',
          //   left: '7.5%',
          //   color: '#1C1CF0',
          //   ease: 'back.out(4)',
          // })
          // .to('.t-08', {
          //   duration: 0.5,
          //   opacity: 1,
          //   position: 'absolute',
          //   display: 'inline',
          //   fontWeight: '900',
          //   fontSize: '3vmax',
          //   top: '60%',
          //   left: '55%',
          //   color: '#292421',
          //   borderTop: 'solid 7.5px #FFE135',
          //   ease: 'elastic.out(1,0.30)',
          // })
          // .to('.t-09', {
          //   duration: 0.5,
          //   opacity: 1,
          //   position: 'absolute',
          //   display: 'inline',
          //   fontWeight: '600',
          //   fontSize: '6vmax',
          //   bottom: '10%',
          //   left: '10%',
          //   color: '#FFE135',
          //   borderBottom: 'solid 7.5px #434343',
          //   ease: 'none',
          // })
          // .to('.t-10', {
          //   duration: 0.5,
          //   opacity: 1,
          //   position: 'absolute',
          //   display: 'inline',
          //   fontWeight: '300',
          //   fontSize: '3vmax',
          //   top: '15%',
          //   right: '2.5%',
          //   color: '#292421',
          // })
          // .to('.t-10', {
          //   rotation: 90,
          //   top: '25%',
          //   fontSize: '2vmax',
          //   ease: 'bounce.out',
          // })
          // .to('.t-11', {
          //   duration: 0.5,
          //   opacity: 1,
          //   position: 'absolute',
          //   display: 'inline',
          //   fontWeight: '900',
          //   fontSize: '2vmax',
          //   top: '30%',
          //   left: '55%',
          //   color: '#292421',
          //   ease: 'elastic.out(1,0.30)',
          // })
          // .to('.t-12', {
          //   duration: 0.5,
          //   opacity: 1,
          //   position: 'absolute',
          //   display: 'inline',
          //   fontWeight: 'lighter',
          //   fontSize: '3vmax',
          //   top: '45%',
          //   left: '57.5%',
          //   color: '#292421',
          //   ease: 'elastic.out(1,0.30)',
          // })
          // .to('.t-a', { duration: 2, opacity: 0 }, '+=3')
          // .set('.t-a', { display: 'none' })
          .set('.main-text-1, .main-text-2, .main-text-3', {
            border: 'none',
            width: 'auto',
            height: 'auto',
            opacity: 1,
            x: 0,
            y: 0,
          })
          .set('.test-stage-intro', { display: 'inline' })
      : null
  }, [landingTransition])

  // gsap landing animations
  useEffect(() => {
    tl_landing
      .to('.landing-transition-left', {
        duration: 1,
        backgroundColor: '#d9d9d9',
        width: '100%',
        height: '100%',
      })
      .to('.landing-transition-left', {
        duration: 1,
        backgroundColor: '#f0f0f0',
        width: '300%',
        x: 2000,
      })
      .to('.landing-transition-left', {
        duration: 1,
        backgroundColor: '#f5f5f5',
        x: -2000,
        onComplete: setlandingTransition,
        onCompleteParams: [false],
      })
      .to('.sider', { duration: 1, height: '100vh', ease: 'bounce.out' }, '-=3')
      .set('.sider-container', { opacity: 1 }, '-=2')
      .from(
        '.sider-section',
        { duration: 0.25, x: -500, stagger: 0.1, ease: 'back.out(2)' },
        '-=2'
      )
      .from(
        '.sider-btn',
        { duration: 0.6, rotationY: 180, stagger: 0.025 },
        '-=1.5'
      )
      .from(
        '.sider-icon, .sider-badge',
        {
          duration: 0.25,
          opacity: 0,
          fontSize: '0',
          stagger: 0.025,
          ease: 'bounce.out',
        },
        '-=1.25'
      )
      .from(
        '.sider-divider',
        {
          duration: 0.5,
          y: -1000,
          stagger: 0.25,
          ease: 'elastic.out(1,0.30)',
        },
        '-=0.75'
      )
  }, [landingTransition, currentViewport, siderState])

  return (
    <div className="front-page">
      {landingTransition ? (
        <div>
          <Container fluid>
            <Row>
              <div className="landing-transition-container">
                <div className="landing-transition-left" />
              </div>
            </Row>
          </Container>
        </div>
      ) : (
        <Container fluid>
          <Row className="front-main-container">
            {currentViewport ? (
              siderState ? (
                <Col xs={12}>
                  <div
                    className="siderShowHide"
                    children={
                      <button onClick={() => setsiderState(!siderState)}>
                        {siderShowHideIcon}
                      </button>
                    }
                  />
                  <div className="sider">
                    <div className="sider-container">
                      {siderLinks.map((e, i) => (
                        <div key={i}>
                          <div className="sider-section">
                            {Object.entries(e).map((e) => (
                              <div className="sider-btn" key={e[0]}>
                                <div className="sider-icon sider-badge pr-4">
                                  {e[1]}
                                </div>
                                <div className="sider-link-badge">
                                  <a href="#">{e[0]}</a>
                                  <span className="sider-badge">
                                    <span>
                                      {Math.floor(Math.random() * 7 + 1)}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          {i === siderLinks.length - 1 ? null : (
                            <hr className="sider-divider" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
              ) : (
                <div
                  className="siderShowHide"
                  children={
                    <button onClick={() => setsiderState(!siderState)}>
                      <FaAlignJustify />
                    </button>
                  }
                />
              )
            ) : (
              <Col xs={12} md={3} className="sider">
                <div className="sider-container">
                  {siderLinks.map((e, i) => (
                    <div key={i}>
                      <div className="sider-section">
                        {Object.entries(e).map((e) => (
                          <div className="sider-btn" key={e[0]}>
                            <div className="sider-icon sider-badge pr-4">
                              {e[1]}
                            </div>
                            <div className="sider-link-badge">
                              <a href="#">{e[0]}</a>
                              <span className="sider-badge">
                                <span>{Math.floor(Math.random() * 7 + 1)}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {i === siderLinks.length - 1 ? null : (
                        <hr className="sider-divider" />
                      )}
                    </div>
                  ))}
                </div>
              </Col>
            )}

            <Col className="front-page-right">
              <Container fluid className="front-page-right-top">
                <Row className="mb-5">
                  <Col>
                    <div className="theme-col">
                      <div className="theme-col-items theme-col-header">
                        <span>try some themes</span>
                      </div>
                      <div className="theme-col-items theme-col-link">
                        <span
                          className="clickable-item position-relative"
                          onClick={themeChanger}
                        >
                          Light
                        </span>
                        &nbsp; | &nbsp;
                        <span
                          className="clickable-item position-relative"
                          onClick={themeChanger}
                        >
                          Dark
                        </span>
                        &nbsp; | &nbsp;
                        <span
                          className="clickable-item position-relative"
                          onClick={themeChanger}
                        >
                          Dull
                        </span>
                        &nbsp; | &nbsp;
                        <span
                          className="clickable-item position-relative"
                          onClick={themeChanger}
                        >
                          Happy
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="current-col">
                      <div className="current-col-items current-col-header">
                        <span>currently working on</span>
                      </div>
                      <div className="current-col-items current-col-link">
                        <span
                          className="clickable-item position-relative"
                          onClick={() =>
                            modalIframeHandler(post.current_project)
                          }
                        >
                          insight | Financial Research Platform
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row className="mb-5">
                  <div className="grad-hr"></div>
                </Row>

                <Row className="mb-5">
                  <Container fluid>
                    <div className="px-5 main-text-row">
                      <div className="main-text-1">
                        <span>
                          <FaSmile className="t-a t-01" />
                        </span>
                        <span>
                          <FaSmileWink className="t-a t-02" />
                        </span>
                      </div>
                      <div className="main-text-2">
                        <span className="t-a t-03 h1"></span>
                        <span className="t-a t-04 h1">
                          <div className="main-text-heart">&#10084;</div>
                          <div>I LIKE</div>
                        </span>
                        <span className="t-a t-05 h1">DESiGN</span>
                        <span className="t-a t-06 h1">C0D1NG</span>
                        <span className="t-a t-07 h1">open source</span>
                        <span className="t-a t-08 h1">THINKERING</span>
                        <span className="t-a t-09 h1">Big Data</span>
                        <span className="t-a t-10 h1">LEARNING</span>
                        <span className="t-a t-11 h1">
                          <h6>FINANCIAL</h6>
                          <span>MODELING</span>
                        </span>
                        <span className="t-a t-12 h1">mathematics</span>
                      </div>
                      <div className="main-text-3">
                        {testStage ? 
                          <div id="test-stage-window" className="" />
                          :
                          <span className="test-stage test-stage-intro clickable-item position-relative" onClick={()=> settestStage(true)}>
                            click here to test <br />
                            something cool I built
                          </span>
                        }
                      </div>
                    </div>
                  </Container>
                </Row>

                <Row className="mb-5">
                  <Container fluid>
                    <Row className="main-languages-numbers">
                      <Col className="main-languages">
                        <Row>
                          <div className="main-languages-header">
                            <span>languages under the belt</span>
                          </div>
                        </Row>
                        <Row className="main-languages-col">
                          <div className="main-languages-text">
                            <div className="main-languages-text-head">
                              <h3>The "Big Idea"</h3>
                            </div>
                            <div className="main-languages-text-body">
                              <span>
                                The idea behind my portfolio page is to
                                implement features and tools rather than write
                                about them.
                                <span className="bg-warning">
                                  &nbsp;Click the&nbsp;
                                  <FaQuestionCircle />
                                  &nbsp;icon&nbsp;
                                </span>
                                &nbsp; next to a feature to learn more about it.
                              </span>
                            </div>
                          </div>
                          <div className="main-languages-wrapper">
                            <img src="/svg/21.svg" alt="tech-pics" />
                          </div>
                          <div className="main-languages-wrapper">
                            <img src="/svg/30.svg" alt="tech-pics" />
                          </div>
                          <div className="main-languages-wrapper">
                            <img src="/svg/28.svg" alt="tech-pics" />
                          </div>
                          <div className="main-languages-wrapper">
                            <img src="/svg/33.svg" alt="tech-pics" />
                          </div>
                        </Row>
                      </Col>
                      <Col className="main-numbers">
                        <Row>
                          <div className="main-numbers-header">
                            <span>some numbers for you</span>
                          </div>
                        </Row>
                        <Row className="main-numbers-col">
                          <div className="main-numbers-wrapper">
                            <h6>
                              <strong>Projects</strong>
                            </h6>
                            <span className="c-text-info h3">
                              <CountUp end={15} redraw delay={6} />
                            </span>
                          </div>
                          <div className="main-numbers-wrapper">
                            <h6>
                              <strong>Vistors</strong>
                            </h6>
                            <span className="c-text-info h3">
                              <CountUp end={65} delay={6} />
                            </span>
                          </div>
                          <div className="main-numbers-wrapper">
                            <h6>
                              <strong>Your Location / ISP</strong>
                            </h6>
                            <span className="c-text-info h5">{vistorLocation}</span>
                          </div>
                        </Row>
                      </Col>
                    </Row>
                  </Container>
                </Row>
              </Container>

              {/* container for bottom/second part of right handside of page */}
              <div className="w-100" ref={(div) => (frontRightBottomRef = div)}>
                {showBottomRight ? (
                  <Container fluid className="front-page-right-bottom">
                    {[post.web_development_skill, post.data_science_skill].map(
                      (e, i) => (
                        <Row
                          key={`skills-${i}`}
                          className="mb-5 overflow-hidden"
                        >
                          <Container
                            fluid
                            className={`skills-row skills-row-${i}`}
                          >
                            <Row>
                              <div
                                className={`d-flex ${
                                  i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                                } w-100 pb-5`}
                              >
                                <div className="mr-2 d-none d-lg-block">
                                  <img
                                    src={`/pics/${i + 1}.jpg`}
                                    alt="web-dev photo"
                                    style={{
                                      width: '400px',
                                      height: '100%',
                                    }}
                                  />
                                </div>
                                <div className="w-100 d-flex flex-column">
                                  <div className="w-100 pr-2 pl-2 pb-2">
                                    <h4>
                                      <strong>{e?.title}</strong>
                                    </h4>
                                    <p>{e?.sub_title}</p>
                                  </div>
                                  <div className="w-100 h-75">
                                    <Container fluid>
                                      <Row>
                                        <Col xs={12} lg={6} className="p-2">
                                          <div>
                                            <h5>
                                              <strong>Frameworks</strong>
                                            </h5>
                                          </div>
                                          <div>
                                            {_sortBy(
                                              Object.entries(
                                                e?.frameworks || {}
                                              ),
                                              [
                                                function (o) {
                                                  return o[1]
                                                },
                                              ]
                                            )
                                              .reverse()
                                              .map((e) => (
                                                <div
                                                  key={e[0]}
                                                  className="d-flex flex-row align-items-center pr-5"
                                                >
                                                  <div className="pr-2">
                                                    {e[0]}
                                                  </div>
                                                  <div className="progress w-50 ml-auto">
                                                    <div
                                                      className={`progress-bar ${skillsLevelBarHelper(
                                                        'color',
                                                        +e[1]
                                                      )} progress-bar-striped progress-bar-animated`}
                                                      role="progressbar"
                                                      aria-valuenow={+e[1]}
                                                      aria-valuemin={0}
                                                      aria-valuemax={100}
                                                      style={{
                                                        width: `${skillsBarAnimator ? e[1] : 0}%`,
                                                      }}
                                                    >
                                                      {skillsLevelBarHelper(
                                                        'description',
                                                        +e[1]
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </Col>
                                        <Col xs={12} lg={6} className="p-2">
                                          <div>
                                            <h5>
                                              <strong>Libraries</strong>
                                            </h5>
                                          </div>
                                          <div>
                                            {_sortBy(
                                              Object.entries(
                                                e?.libraries || {}
                                              ),
                                              [
                                                function (o) {
                                                  return o[1]
                                                },
                                              ]
                                            )
                                              .reverse()
                                              .map((e) => (
                                                <div
                                                  key={e[0]}
                                                  className="d-flex flex-row align-items-center pr-5"
                                                >
                                                  <div className="pr-2">
                                                    {e[0]}
                                                  </div>
                                                  <div className="progress w-50 ml-auto">
                                                    <div
                                                      className={`progress-bar ${skillsLevelBarHelper(
                                                        'color',
                                                        +e[1]
                                                      )} progress-bar-striped progress-bar-animated`}
                                                      role="progressbar"
                                                      aria-valuenow={+e[1]}
                                                      aria-valuemin={0}
                                                      aria-valuemax={100}
                                                      style={{
                                                        width: `${skillsBarAnimator ? e[1] : 0}%`,
                                                      }}
                                                    >
                                                      {skillsLevelBarHelper(
                                                        'description',
                                                        +e[1]
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </Col>
                                        <Col xs={12} lg={6} className="p-2">
                                          <div>
                                            <h5>
                                              <strong>Technologies</strong>
                                            </h5>
                                          </div>
                                          <div>
                                            {_sortBy(
                                              Object.entries(
                                                e?.technologies || {}
                                              ),
                                              [
                                                function (o) {
                                                  return o[1]
                                                },
                                              ]
                                            )
                                              .reverse()
                                              .map((e) => (
                                                <div
                                                  key={e[0]}
                                                  className="d-flex flex-row align-items-center pr-5"
                                                >
                                                  <div className="pr-2">
                                                    {e[0]}
                                                  </div>
                                                  <div className="progress w-50 ml-auto">
                                                    <div
                                                      className={`progress-bar ${skillsLevelBarHelper(
                                                        'color',
                                                        +e[1]
                                                      )} progress-bar-striped progress-bar-animated`}
                                                      role="progressbar"
                                                      aria-valuenow={+e[1]}
                                                      aria-valuemin={0}
                                                      aria-valuemax={100}
                                                      style={{
                                                        width: `${skillsBarAnimator ? e[1] : 0}%`,
                                                      }}
                                                    >
                                                      {skillsLevelBarHelper(
                                                        'description',
                                                        +e[1]
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </Col>
                                        <Col xs={12} lg={6} className="p-2">
                                          <div>
                                            <h5>
                                              <strong>Tools</strong>
                                            </h5>
                                          </div>
                                          <div>
                                            {_sortBy(
                                              Object.entries(e?.tools || {}),
                                              [
                                                function (o) {
                                                  return o[1]
                                                },
                                              ]
                                            )
                                              .reverse()
                                              .map((e) => (
                                                <div
                                                  key={e[0]}
                                                  className="d-flex flex-row align-items-center pr-5"
                                                >
                                                  <div className="pr-2">
                                                    {e[0]}
                                                  </div>
                                                  <div className="progress w-50 ml-auto">
                                                    <div
                                                      className={`progress-bar ${skillsLevelBarHelper(
                                                        'color',
                                                        +e[1]
                                                      )} progress-bar-striped progress-bar-animated`}
                                                      role="progressbar"
                                                      aria-valuenow={+e[1]}
                                                      aria-valuemin={0}
                                                      aria-valuemax={100}
                                                      style={{
                                                        width: `${skillsBarAnimator ? e[1] : 0}%`,
                                                      }}
                                                    >
                                                      {skillsLevelBarHelper(
                                                        'description',
                                                        +e[1]
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </Col>
                                      </Row>
                                    </Container>
                                  </div>
                                  <div className="w-100 p-2">
                                    <h4>Projects</h4>
                                  </div>
                                </div>
                              </div>
                            </Row>
                          </Container>
                        </Row>
                      )
                    )}
                  </Container>
                ) : null}
              </div>

              {/* modal for showing iframe when currently working on is clicked */}
              <Container fluid className="iframe-modal">
                <Modal
                  size="xl"
                  show={modalShow}
                  onHide={() => {
                    setmodalShow(false)
                    setiframeStatus(
                      <Spinner
                        animation="border"
                        role="status"
                        variant="primary"
                      />
                    )
                  }}
                  aria-labelledby="modal-for-current"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                      {modalContent.header}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      {modalContent.body?.split('%').map((e, i) => (
                        <p key={i}>{e}</p>
                      ))}
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="position-absolute">{iframeStatus}</div>
                      <iframe
                        src={modalContent.src}
                        title={modalContent.title}
                        onLoad={() => setiframeStatus(null)}
                      />
                    </div>
                  </Modal.Body>
                </Modal>
              </Container>

              {/* container for footer of page */}
              <Container fluid className="front-page-right-footer">
                <Footer />
              </Container>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  )
}

export default Front

export const getStaticProps: GetStaticProps = async () => {
  const post: object = {
    current_project: {
      src: 'https://insight-client.herokuapp.com/',
      title: 'insight',
      header: 'insight | Financial Research Platform',
      body: `This is an open source project with a goal to consolidate equity research for all publicly traded companies. This consolidation will allow for more complex analysis to be layered on top of the structured data. % In later iterations portfolio optimisation and sentimental analysis tools will be implemented to allow for prudent investment.`,
    },
    web_development_skill: {
      title: 'Web Development',
      sub_title:
        'having been coding for many years I have used a lot of frameworks and libraries. Below is how comfortable I am with some of the major ones.',
      frameworks: {
        react: 90,
        vue: 60,
        next: 85,
        express: 90,
        nest: 70,
        loopback: 50,
        jest: 75,
      },
      libraries: {
        jquery: 90,
        lodash: 90,
        chartjs: 85,
        gsap: 75,
        d3: 75,
        boostrap: 90,
        'material ui': 90,
      },
      technologies: {
        nodejs: 90,
        git: 90,
        npm: 90,
        docker: 90,
        sql: 90,
        'nosql (mongoDB)': 90,
        graphql: 75,
      },
      tools: {
        'adobe xd': 90,
        sass: 90,
        'chrome tools': 90,
        webpack: 80,
        browserify: 80,
        gulp: 75,
        grunt: 65,
      },
      projects: {},
    },
    data_science_skill: {
      title: 'Data Science',
      sub_title:
        'I use Python & R alot for doing tasks related to data cleaning, structuring, anlysis (including Machine learning) and visualisation. Below is how comfortable I am with some of the major ones.',
      frameworks: {
        django: 50,
        dash: 50,
        flask: 50,
      },
      libraries: {
        numpy: 90,
        scipy: 90,
        pandas: 90,
        matplotlib: 80,
        seaborn: 75,
        'sciKit-learn': 65,
        TensorFlow: 65,
      },
      technologies: {
        pip: 90,
        anaconda: 85,
        NLP: 50,
        ML: 65,
      },
      tools: {
        jupyter: 90,
        spyder: 90,
        'r studio': 75,
        pyenv: 90,
        tableau: 50,
      },
      projects: {
        monte_carlo: 'hello',
      },
    },
  }

  return {
    props: {
      post,
    },
  }
}

// &#128170;&#129327;&#9939;&#128200;&#129516;&#128218;&#128071;&#129300;
