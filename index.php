<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, user-scalable=no">
    <title>Mapa - Gymnázium Ostrava-Hrabůvka</title>
    <meta name="author" content="Vojtěch Masný"/>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">

    <link rel="stylesheet" type="text/css" href="css/style.css"/>
    <link rel="icon" type="image/png" href="favicon.png"/>

    <!-- Manifest file for PWA -->
    <link rel="manifest" href="manifest.json">
</head>

<body onload="loaded()">
<div id="map">
    <svg class="hidden">
        <defs>
            <symbol id="icon-pin" viewBox="0 0 200 300">
                <title>pin</title>
                <path d="M100,21.78A85,85,0,0,0,15.18,106.6c0,18.85,12.08,49.52,36.76,93.9,17.48,31.36,34.7,57.49,35.47,58.6L100,278.22l12.59-19.11c0.69-1.11,18-27.25,35.47-58.6,24.76-44.38,36.76-75.06,36.76-93.9A85,85,0,0,0,100,21.78Z"/>
            </symbol>
            <symbol id="icon-stairs">
                <title>stairs</title>
                <line x1="50%" y1="0" x2="50%" y2="100%"/>
            </symbol>
            <symbol id="icon-footsteps" viewBox="0 0 32 44">
                <path d="m19.531 33.01c2.3909 0.81281 4.502 1.3305 7.5353 2.2558-1.1653 14.617-15.089 8.8121-7.5353-2.2558zm12.431-13.427c-0.15701-4.3888-0.93571-10.146-7.1384-9.2439-2.9076 0.75331-5.056 3.9234-6.0665 9.3927-0.55496 3.0072-0.23225 7.2282 0.42237 9.7585 0.5977 1.7831 0.39442 1.6735 1.0368 2.0121 2.4864 0.55604 4.9479 1.1716 7.4545 1.7992 2.5464-1.7852 4.6378-11.263 4.2912-13.719zm-19.142-0.33683c0.6541-2.5306 0.97681-6.7516 0.42211-9.7585-1.0097-5.4696-3.1583-8.6401-6.0665-9.3929-6.2027-0.90209-6.9814 4.855-7.1384 9.2441-0.34661 2.4557 1.745 11.934 4.2917 13.718 2.5064-0.62766 4.9675-1.2427 7.4547-1.7992 0.64163-0.33829 0.43836-0.22877 1.0363-2.0119zm-7.887 5.7763c1.1649 14.617 15.088 8.8119 7.535-2.2558-2.3909 0.81289-4.5018 1.3305-7.535 2.2558z"/>
            </symbol>
            <symbol id="icon-time" viewBox="0 0 384 384">
                <path d="m343.59375 101.039062c-7.953125 3.847657-11.28125 13.417969-7.433594 21.367188 10.511719 21.714844 15.839844 45.121094 15.839844 69.59375 0 88.222656-71.777344 160-160 160s-160-71.777344-160-160 71.777344-160 160-160c36.558594 0 70.902344 11.9375 99.328125 34.519531 6.894531 5.503907 16.976563 4.351563 22.480469-2.566406 5.503906-6.914063 4.351562-16.984375-2.570313-22.480469-33.652343-26.746094-76-41.472656-119.238281-41.472656-105.863281 0-192 86.136719-192 192s86.136719 192 192 192 192-86.136719 192-192c0-29.335938-6.40625-57.449219-19.039062-83.527344-3.839844-7.96875-13.441407-11.289062-21.367188-7.433594zm0 0"/>
                <path d="m192 64c-8.832031 0-16 7.167969-16 16v112c0 8.832031 7.167969 16 16 16h80c8.832031 0 16-7.167969 16-16s-7.167969-16-16-16h-64v-96c0-8.832031-7.167969-16-16-16zm0 0"/>
            </symbol>
            <symbol id="icon-distance" viewBox="0 0 512 512">
                <path d="M400,368c-20.864,0-38.464,13.408-45.056,32H157.056c-6.624-18.592-24.192-32-45.056-32c-26.496,0-48,21.504-48,48
								c0,26.496,21.504,48,48,48c20.864,0,38.464-13.408,45.056-32h197.888c6.624,18.592,24.192,32,45.056,32c26.496,0,48-21.504,48-48
								C448,389.504,426.496,368,400,368z"/>
                <path d="M112,48C50.24,48,0,98.24,0,160c0,57.472,89.856,159.264,100.096,170.688c3.04,3.36,7.36,5.312,11.904,5.312
								s8.864-1.952,11.904-5.312C134.144,319.264,224,217.472,224,160C224,98.24,173.76,48,112,48z M112,208c-26.496,0-48-21.504-48-48
								c0-26.496,21.504-48,48-48c26.496,0,48,21.504,48,48C160,186.496,138.496,208,112,208z"/>
                <path d="M400,48c-61.76,0-112,50.24-112,112c0,57.472,89.856,159.264,100.096,170.688c3.04,3.36,7.36,5.312,11.904,5.312
								s8.864-1.952,11.904-5.312C422.144,319.264,512,217.472,512,160C512,98.24,461.76,48,400,48z M400,208c-26.496,0-48-21.504-48-48
								c0-26.496,21.504-48,48-48c26.496,0,48,21.504,48,48C448,186.496,426.496,208,400,208z"/>
            </symbol>
        </defs>
    </svg>
    <div class="school">
        <div class="levels">
            <div class="level level--1" aria-label="Level 1">
                <svg class="level_map level_map--1" viewBox="-0 0 1200 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="levelFogGradient" x1="50%" y1="50%" x2="100%" y2="0%">
                            <stop offset="0" stop-color="rgb(255,255,255)"/>
                            <stop offset="1" stop-color="rgb(150,150,150)"/>
                        </linearGradient>
                        <mask id="levelFog" x="0" y="0" width="100%" height="100%">
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#levelFogGradient)"/>
                        </mask>
                    </defs>
                    <g id="gLevel1" height="100%" width="100%" x="0" y="0" mask="url(#levelFog)">
                        <path
                                d="m 0,0.67164 v 606.26068 h 433.77989 v 45.78323 h 98.87513 v -45.78323 h 82.71061 V 799.9986 H 1041.7428 V 485.67615 H 614.43277 v 28.91377 H 534.3693 V 130.31432 H 1200 V 0.66662 Z M 126.62822,131.34322 H 404.95151 V 446.19763 H 126.62822 Z"
                                class="map__ground"
                                id="outline1"/>
                        <rect
                                y="606.93079"
                                x="433.77725"
                                height="45.783695"
                                width="98.875397"
                                class="map__space map__special"
                                id="1"/>
                        <rect
                                height="87.18959"
                                width="382.60907"
                                y="518.18958"
                                x="1.0414103"
                                class="map__space"
                                id="2"/>
                        <rect
                                height="61.401672"
                                width="22.156404"
                                y="518.15216"
                                x="383.6131"
                                class="map__space map__special"
                                id="3"/>
                        <rect
                                height="33.075485"
                                width="123.69457"
                                y="485.11725"
                                x="0.99661684"
                                class="map__space map__buffet map__special"
                                id="124"/>
                        <rect
                                height="109.97012"
                                width="79.428238"
                                y="336.17831"
                                x="1.859542"
                                class="map__space"
                                id="121"/>
                        <rect
                                height="107.952"
                                width="79.377068"
                                y="228.22632"
                                x="1.9107144"
                                class="map__space"
                                id="120"/>
                        <rect
                                height="99.925476"
                                width="79.414864"
                                y="128.27461"
                                x="1.8844945"
                                class="map__space"
                                id="119"/>
                        <rect
                                height="23.311651"
                                width="79.361832"
                                y="81.976074"
                                x="1.9375237"
                                class="map__space"
                                id="116"/>
                        <rect
                                height="81.653488"
                                width="101.13168"
                                y="0.46418571"
                                x="1.9553913"
                                class="map__space"
                                id="115"/>
                        <rect
                                height="70.341225"
                                width="80.979271"
                                y="130.28062"
                                x="453.80267"
                                class="map__space"
                                id="105"/>
                        <rect
                                height="34.405106"
                                width="80.979271"
                                y="200.62184"
                                x="453.80267"
                                class="map__space"
                                id="104"/>
                        <rect
                                height="96.202858"
                                width="80.939178"
                                y="235.02693"
                                x="453.84283"
                                class="map__space"
                                id="103"/>
                        <rect
                                height="73.637085"
                                width="54.036724"
                                y="331.22986"
                                x="480.74527"
                                class="map__space map__special"
                                id="102"/>
                        <rect
                                height="41.235004"
                                width="80.909042"
                                y="404.86688"
                                x="453.87292"
                                class="map__space"
                                id="101"/>
                        <rect
                                height="81.705208"
                                width="98.031471"
                                y="0.52088028"
                                x="190.748"
                                class="map__space"
                                id="113"/>
                        <rect
                                height="81.452972"
                                width="85.417526"
                                y="0.50373358"
                                x="288.76233"
                                class="map__space"
                                id="112"/>
                        <rect
                                height="81.57859"
                                width="106.96375"
                                y="0.50373358"
                                x="374.17987"
                                class="map__space"
                                id="111"/>
                        <rect
                                height="81.579033"
                                width="43.873047"
                                y="0.50839883"
                                x="146.86247"
                                class="map__space"
                                id="114"/>
                        <rect
                                height="52.267086"
                                width="37.796936"
                                y="0.5887621"
                                x="481.14362"
                                class="map__space"
                                id="110"/>
                        <rect
                                height="81.922554"
                                width="94.444977"
                                y="0.73791027"
                                x="633.12671"
                                class="map__space"
                                id="134"/>
                        <rect
                                height="81.657265"
                                width="40.160786"
                                y="0.73791027"
                                x="727.57166"
                                class="map__space"
                                id="135"/>
                        <rect
                                height="83.553589"
                                width="62.842419"
                                y="0.66662002"
                                x="919.76752"
                                class="map__space"
                                id="139"/>
                        <rect
                                height="83.65139"
                                width="30.943855"
                                y="0.66662002"
                                x="982.60992"
                                class="map__space"
                                id="140"/>
                        <rect
                                height="83.739723"
                                width="74.061485"
                                y="0.66662002"
                                x="1013.5538"
                                class="map__space"
                                id="141"/>
                        <rect
                                height="83.733063"
                                width="34.290008"
                                y="0.66662002"
                                x="1087.6154"
                                class="map__space"
                                id="142"/>
                        <rect
                                height="56.394127"
                                width="32.590038"
                                y="485.70163"
                                x="734.57605"
                                class="map__space"
                                id="17"/>
                        <rect
                                height="136.93365"
                                width="42.738674"
                                y="485.76788"
                                x="999.00415"
                                class="map__space"
                                id="24"/>
                        <rect
                                height="36.002556"
                                width="88.579262"
                                y="587.77637"
                                x="615.27643"
                                class="map__space"
                                id="10"/>
                        <rect
                                height="56.321877"
                                width="33.253101"
                                y="485.73773"
                                x="965.78314"
                                class="map__space"
                                id="23"/>
                        <rect
                                height="56.520252"
                                width="32.254013"
                                y="485.65698"
                                x="933.64673"
                                class="map__space"
                                id="22"/>
                        <rect
                                height="56.483372"
                                width="34.757759"
                                y="485.65698"
                                x="867.17889"
                                class="map__space"
                                id="21"/>
                        <rect
                                height="56.465755"
                                width="33.014885"
                                y="485.6658"
                                x="834.31671"
                                class="map__space"
                                id="19"/>
                        <rect
                                height="56.493187"
                                width="32.773048"
                                y="485.63419"
                                x="767.13446"
                                class="map__space"
                                id="18"/>
                        <rect
                                height="83.824837"
                                width="77.83551"
                                y="0.66662002"
                                x="1122.1646"
                                class="map__space"
                                id="143"/>
                        <path
                                d="m 703.85569,587.77637 h 36.83558 v 36.00258 h 24.32299 V 799.9986 H 615.36563 l -0.0892,-176.21965 h 88.58006 z"
                                class="map__space"
                                id="16"/>
                        <rect
                                id="117"
                                class="map__space"
                                x="1.8736572"
                                y="105.28773"
                                width="79.425697"
                                height="22.986887"/>
                        <rect
                                id="131"
                                class="map__space map__wc_girls map__special"
                                x="518.7829"
                                y="0.66398603"
                                width="58.381935"
                                height="81.343109"/>
                        <rect
                                height="82.188103"
                                width="56.02459"
                                y="0.66398603"
                                x="577.16486"
                                class="map__space map__wc map__special"
                                id="133"/>
                        <rect
                                id="P"
                                class="map__space"
                                x="869.48645"
                                y="0.75866503"
                                width="50.281044"
                                height="83.46154"/>
                        <rect
                                id="126"
                                class="map__space"
                                x="454.79916"
                                y="484.52036"
                                width="79.570114"
                                height="30.069551"/>
                        <rect
                                id="14"
                                class="map__space map__wc_girls map__special"
                                x="703.78021"
                                y="485.73773"
                                width="30.831991"
                                height="56.321865"/>
                        <rect
                                height="56.321892"
                                width="32.230442"
                                y="485.73773"
                                x="671.54974"
                                class="map__space map__wc map__special"
                                id="11"/>
                        <rect
                                id="S"
                                class="map__space"
                                x="648.15564"
                                y="485.73773"
                                width="23.394028"
                                height="56.321892"/>
                        <g
                                id="g16457"
                                transform="matrix(3.5788114,0,0,3.7795276,24.911319,-2e-5)"
                                class="map__stairs">
                            <path
                                    id="path15769"
                                    d="m 124.6122,117.96243 v 10.23358"/>
                            <path
                                    id="path15769-8"
                                    d="m 137.19196,117.96243 v 10.23358"/>
                            <path
                                    id="path15769-7"
                                    d="m 141.38521,117.96243 v 10.23358"/>
                            <path
                                    id="path15769-1"
                                    d="m 132.9987,117.96243 v 10.23358"/>
                            <path
                                    id="path15769-15"
                                    d="m 128.80545,117.96243 v 10.23358"/>
                        </g>
                        <g
                                id="g16450"
                                transform="matrix(3.7795275,0,0,3.7795276,0,-2e-5)"
                                class="map__stairs">
                            <path
                                    id="path15769-6"
                                    d="m 0.57649535,118.03263 v 10.40043"/>
                            <path
                                    id="path15769-8-2"
                                    d="m 12.917374,118.11605 v 10.23358"/>
                            <path
                                    id="path15769-7-4"
                                    d="m 17.030284,118.11605 v 10.23358"/>
                            <path
                                    id="path15769-1-3"
                                    d="m 8.8044641,118.11605 v 10.23358"/>
                            <path
                                    id="path15769-15-1"
                                    d="m 4.691554,118.11605 v 10.23358"/>
                        </g>
                        <g
                                id="g16464"
                                transform="matrix(3.7795275,0,0,3.7795276,0,-2e-5)"
                                class="map__stairs">
                            <path
                                    id="path15769-0"
                                    d="m 162.64912,142.59579 h 8.88719"/>
                            <path
                                    id="path15769-8-1"
                                    d="m 162.64912,132.35196 h 8.88719"/>
                            <path
                                    id="path15769-7-9"
                                    d="m 162.64912,128.93735 h 8.88719"/>
                            <path
                                    id="path15769-1-9"
                                    d="m 162.64912,135.76657 h 8.88719"/>
                            <path
                                    id="path15769-15-7"
                                    d="m 162.64912,139.18118 h 8.88719"/>
                        </g>
                        <g
                                id="g16506"
                                transform="matrix(5.5276616,0,0,3.7795276,-360.88861,7.4339908)"
                                class="map__stairs">
                            <path
                                    id="path15769-0-2"
                                    d="m 204.17694,19.833479 h 18.4044"/>
                            <path
                                    id="path15769-8-1-2"
                                    d="m 204.17694,5.2774395 h 18.4044"/>
                            <path
                                    id="path15769-7-9-8"
                                    d="m 204.17694,0.42542622 h 18.4044"/>
                            <path
                                    id="path15769-1-9-9"
                                    d="m 204.17694,10.129453 h 18.4044"/>
                            <path
                                    id="path15769-15-7-1"
                                    d="m 204.17694,14.981466 h 18.4044"/>
                        </g>
                        <rect
                                id="S2"
                                class="map__space"
                                x="103.11423"
                                y="0.49135756"
                                width="43.731209"
                                height="81.679764"/>
                        <rect
                                id="108"
                                class="map__space"
                                x="494.52127"
                                y="52.775848"
                                width="24.341635"
                                height="29.311243"/>
                        <rect
                                height="20.50371"
                                width="22.319967"
                                y="61.805962"
                                x="565.55743"
                                class="map__space"
                                id="132"/>
                        <rect
                                height="29.231241"
                                width="13.37765"
                                y="52.855846"
                                x="481.14362"
                                class="map__space"
                                id="109"/>
                        <rect
                                id="SprchyZ"
                                class="map__space"
                                x="799.90753"
                                y="485.6658"
                                width="34.409195"
                                height="56.46159"/>
                        <rect
                                height="56.431629"
                                width="31.710106"
                                y="485.65698"
                                x="901.93665"
                                class="map__space"
                                id="SprchyM"/>
                        <path
                                id="20"
                                class="map__space"
                                d="m 887.5886,588.12164 111.41555,2e-5 v 34.57988 l 42.73865,-3e-5 V 799.9986 H 765.01426 l -0.19638,-177.29709 h 122.77249 z"/>
                        <rect
                                height="15.631474"
                                width="11.708356"
                                y="526.41943"
                                x="703.78894"
                                class="map__space"
                                id="13"/>
                        <rect
                                id="12"
                                class="map__space"
                                x="692.07184"
                                y="526.4281"
                                width="11.708356"
                                height="15.631474"/>
                    </g>
                </svg>
                <canvas class="level__canvas" id="level--1-navigator" width="1200px" height="800px"></canvas>
                <a class="pin stairs" id="stairs-1">
							<span class="pin__icon">
									<svg class="icon icon--pin">
										<use xlink:href="#icon-stairs"></use>
									</svg>
								</span>
                </a>
                <a class="pin stairs" id="stairs-1b">
							<span class="pin__icon">
									<svg class="icon icon--pin">
										<use xlink:href="#icon-stairs"></use>
									</svg>
								</span>
                </a>
                <a class="pin target" id="target-1">
							<span class="pin__icon">
									<svg class="icon icon--pin">
										<use xlink:href="#icon-pin"></use>
									</svg>
								</span>
                    <span class="pin-text target-text pin-hidden"></span>
                </a>
                <a class="pin here" id="here-1">
							<span class="pin__icon">
									<svg class="icon icon--pin">
										<use xlink:href="#icon-pin"></use>
									</svg>
								</span>
                    <span class="pin-text here-text pin-hidden">Start
								</span>
                </a>
            </div>
            <div class="level level--2" aria-label="Level 2">
                <svg class="level_map level_map--2" viewBox="0 0 1200 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="levelFogGradient" x1="50%" y1="50%" x2="100%" y2="0%">
                            <stop offset="0" stop-color="rgb(255,255,255)"/>
                            <stop offset="1" stop-color="rgb(150,150,150)"/>
                        </linearGradient>
                        <mask id="levelFog" x="0" y="0" width="100%" height="100%">
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#levelFogGradient)"/>
                        </mask>
                    </defs>
                    <g mask="url(#levelFog)" x="0" y="0" width="100%" height="100%" id="gLevel2">
                        <path
                                id="outline2"
                                class="map__ground"
                                d="m 613.8,605.82 h 426.59 v -120.8 h -426 c 0.0534,41.058 -0.36389,85.783 -0.5875,120.8 z M 534.56953,131 H 1198.1595 V 1.84 H 1.85953 v 516.5766 l 126.24,0.10609 v -386.5066 h 277.47 V 518.55321 L 533.87277,518.1879 C 535.2253,351.10434 534.56953,289.27 534.56953,131 Z"/>
                        <rect
                                id="218"
                                class="map__space"
                                x="3.9989903"
                                y="344.71426"
                                width="79.213547"
                                height="109.69244"/>
                        <rect
                                id="217"
                                class="map__space"
                                x="3.9989903"
                                y="236.83376"
                                width="79.21714"
                                height="107.88049"/>
                        <rect
                                id="216"
                                class="map__space"
                                x="3.9883211"
                                y="131.19751"
                                width="79.237961"
                                height="105.62472"/>
                        <rect
                                id="214"
                                class="map__space"
                                x="3.9628"
                                y="82.782997"
                                width="79.32"
                                height="48.502998"/>
                        <rect
                                id="213"
                                class="map__space"
                                x="3.8039134"
                                y="1.6478132"
                                width="108.41312"
                                height="81.293579"/>
                        <rect
                                id="211"
                                class="map__space"
                                x="211.09494"
                                y="1.6444547"
                                width="99.784157"
                                height="81.321129"/>
                        <rect
                                id="210"
                                class="map__space"
                                x="310.86832"
                                y="1.7387935"
                                width="71.954918"
                                height="81.216003"/>
                        <rect
                                id="209"
                                class="map__space"
                                x="382.81158"
                                y="1.7350224"
                                width="65.489105"
                                height="81.248566"/>
                        <rect
                                id="212"
                                class="map__space"
                                x="112.25297"
                                y="1.7179248"
                                width="98.84198"
                                height="81.247658"/>
                        <rect
                                id="208"
                                class="map__space"
                                x="448.30069"
                                y="1.6786343"
                                width="70.695885"
                                height="81.304955"/>
                        <rect
                                id="224"
                                class="map__space"
                                x="621.37146"
                                y="1.7194309"
                                width="100.0449"
                                height="81.260124"/>
                        <rect
                                id="225"
                                class="map__space"
                                x="721.36578"
                                y="1.6688184"
                                width="38.545162"
                                height="81.288216"/>
                        <rect
                                id="228"
                                class="map__space"
                                x="865.5683"
                                y="1.6688187"
                                width="98.104652"
                                height="83.689484"/>
                        <rect
                                id="229"
                                class="map__space"
                                x="963.59332"
                                y="1.605629"
                                width="27.387114"
                                height="83.832336"/>
                        <rect
                                id="25"
                                class="map__space"
                                x="663.23846"
                                y="485.0903"
                                width="81.097336"
                                height="55.930359"/>
                        <rect
                                id="31"
                                class="map__space"
                                x="967.76282"
                                y="541.03998"
                                width="72.627167"
                                height="64.690002"/>
                        <rect
                                id="30"
                                class="map__space"
                                x="934.47919"
                                y="485.01999"
                                width="105.91084"
                                height="56.031719"/>
                        <rect
                                id="29"
                                class="map__space"
                                x="897.65234"
                                y="484.79886"
                                width="36.826832"
                                height="56.252838"/>
                        <rect
                                id="28"
                                class="map__space"
                                x="860.25275"
                                y="484.7673"
                                width="37.454319"
                                height="56.229675"/>
                        <rect
                                id="27"
                                class="map__space"
                                x="784.11853"
                                y="484.87521"
                                width="76.178024"
                                height="56.1628"/>
                        <rect
                                id="26"
                                class="map__space"
                                x="744.21448"
                                y="484.89014"
                                width="39.904076"
                                height="56.147884"/>
                        <rect
                                id="233"
                                class="map__space"
                                x="1130.7965"
                                y="85.357597"
                                width="67.354477"
                                height="45.641003"/>
                        <rect
                                id="202"
                                class="map__space"
                                x="455.40762"
                                y="351.04724"
                                width="79.209999"
                                height="102.69324"/>
                        <rect
                                id="203"
                                class="map__space"
                                x="455.40762"
                                y="241.44833"
                                width="79.163345"
                                height="109.59888"/>
                        <rect
                                id="204"
                                class="map__space"
                                x="455.40762"
                                y="130.99504"
                                width="79.170349"
                                height="110.45329"/>
                        <rect
                                id="230"
                                class="map__space"
                                x="990.98041"
                                y="1.6853"
                                width="88.043953"
                                height="83.835716"/>
                        <rect
                                id="231"
                                class="map__space"
                                x="1079.0244"
                                y="1.831978"
                                width="26.980463"
                                height="83.689041"/>
                        <rect
                                id="232"
                                class="map__space"
                                x="1106.0049"
                                y="1.84"
                                width="92.154678"
                                height="83.681023"/>
                        <g
                                id="g16450"
                                transform="matrix(3.7795275,0,0,3.1450612,1.4219797,83.872443)"
                                class="map__stairs">
                            <path
                                    id="path15769-6"
                                    d="m 0.57649535,118.03263 v 10.40043"/>
                            <path
                                    id="path15769-8-2"
                                    d="m 12.917374,118.11605 v 10.23358"/>
                            <path
                                    id="path15769-7-4"
                                    d="m 17.030284,118.11605 v 10.23358"/>
                            <path
                                    id="path15769-1-3"
                                    d="m 8.8044641,118.11605 v 10.23358"/>
                            <path
                                    id="path15769-15-1"
                                    d="m 4.691554,118.11605 v 10.23358"/>
                        </g>
                        <rect
                                height="30.614325"
                                width="126.24001"
                                y="487.80228"
                                x="1.85953"
                                class="map__space map__wc_girls map__special"
                                id="219"/>
                        <rect
                                id="200"
                                class="map__space map__wc_girls map__special"
                                x="440.03723"
                                y="487.57358"
                                width="93.835526"
                                height="30.614325"/>
                        <rect
                                height="30.850208"
                                width="33.949707"
                                y="487.703"
                                x="405.56952"
                                class="map__space"
                                id="201"/>
                        <g
                                transform="matrix(0,-3.2754365,4.7664753,0,51.392765,540.80161)"
                                id="g17735"
                                class="map__stairs">
                            <path
                                    d="m 0.57649535,118.03263 v 10.40043"
                                    id="path17725"/>
                            <path
                                    d="m 12.917374,118.11605 v 10.23358"
                                    id="path17727"/>
                            <path
                                    d="m 17.030284,118.11605 v 10.23358"
                                    id="path17729"/>
                            <path
                                    d="m 8.8044641,118.11605 v 10.23358"
                                    id="path17731"/>
                            <path
                                    d="m 4.691554,118.11605 v 10.23358"
                                    id="path17733"/>
                        </g>
                        <rect
                                height="81.186996"
                                width="51.226002"
                                y="1.7560005"
                                x="518.95599"
                                class="map__space map__wc_girls map__special"
                                id="221"/>
                        <rect
                                id="223"
                                class="map__space map__wc map__special"
                                x="570.18201"
                                y="1.7560005"
                                width="51.226002"
                                height="81.186996"/>
                        <rect
                                height="23.515551"
                                width="23.543474"
                                y="59.736084"
                                x="558.88531"
                                class="map__space"
                                id="222"/>
                        <g
                                transform="matrix(3.7795275,0,0,3.1450612,467.48332,83.218353)"
                                id="g17753"
                                class="map__stairs">
                            <path
                                    d="m 0.57649535,118.03263 v 10.40043"
                                    id="path17743"/>
                            <path
                                    d="m 12.917374,118.11605 v 10.23358"
                                    id="path17745"/>
                            <path
                                    d="m 17.030284,118.11605 v 10.23358"
                                    id="path17747"/>
                            <path
                                    d="m 8.8044641,118.11605 v 10.23358"
                                    id="path17749"/>
                            <path
                                    d="m 4.691554,118.11605 v 10.23358"
                                    id="path17751"/>
                        </g>
                        <g
                                id="g17765"
                                transform="matrix(0,-4.7503912,10.324571,0,-459.58659,82.56933)"
                                class="map__stairs">
                            <path
                                    id="path17755"
                                    d="m 0.57649535,118.03263 v 10.40043"/>
                            <path
                                    id="path17757"
                                    d="m 12.917374,118.11605 v 10.23358"/>
                            <path
                                    id="path17759"
                                    d="m 17.030284,118.11605 v 10.23358"/>
                            <path
                                    id="path17761"
                                    d="m 8.8044641,118.11605 v 10.23358"/>
                            <path
                                    id="path17763"
                                    d="m 4.691554,118.11605 v 10.23358"/>
                        </g>
                        <rect
                                id="207"
                                class="map__space"
                                x="484.69409"
                                y="44.451527"
                                width="34.132935"
                                height="38.362488"/>
                    </g>
                </svg>
                <canvas class="level__canvas" id="level--2-navigator" width="1200px" height="800px"></canvas>
                <a class="pin stairs" id="stairs-2">
							<span class="pin__icon">
									<svg class="icon icon--pin">
										<use xlink:href="#icon-stairs"></use>
									</svg>
								</span>
                </a>
                <a class="pin target" id="target-2">
							<span class="pin__icon">
									<svg class="icon icon--pin">
										<use xlink:href="#icon-pin"></use>
									</svg>
								</span>
                    <span class="pin-text target-text pin-hidden"></span>
                </a>
                <a class="pin here" id="here-2">
							<span class="pin__icon">
									<svg class="icon icon--pin">
										<use xlink:href="#icon-pin"></use>
									</svg>
								</span>
                    <span class="pin-text here-text pin-hidden">Start
								</span>
                </a>
            </div>
            <div class="level level--3" aria-label="Level 3">
                <svg class="level_map level_map--3" viewBox="0 0 1200 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="levelFogGradient" x1="50%" y1="50%" x2="100%" y2="0%">
                            <stop offset="0" stop-color="rgb(255,255,255)"/>
                            <stop offset="1" stop-color="rgb(150,150,150)"/>
                        </linearGradient>
                        <mask id="levelFog" x="0" y="0" width="100%" height="100%">
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#levelFogGradient)"/>
                        </mask>
                    </defs>
                    <g mask="url(#levelFog)" x="0" y="0" width="100%" height="100%" id="gLevel3">
                        <path
                                id="outline3"
                                class="map__ground"
                                d="M 534.57353,131 H 1198.1635 V 1.84 H 1.86353 v 516.14102 l 126.24,0.10609 V 132.01609 h 277.47 v 386.07102 l 128.30323,-0.0389 C 535.2293,342.55 534.57353,289.27 534.57353,131 Z"/>
                        <rect
                                id="319"
                                class="map__space"
                                x="4.0153451"
                                y="343.61783"
                                width="79.212311"
                                height="101.65858"/>
                        <rect
                                id="318"
                                class="map__space"
                                x="4.0096445"
                                y="237.83565"
                                width="79.188309"
                                height="105.7921"/>
                        <rect
                                id="317"
                                class="map__space"
                                x="4.0096445"
                                y="131.21884"
                                width="79.195305"
                                height="106.61681"/>
                        <rect
                                id="315"
                                class="map__space"
                                x="3.9628"
                                y="82.782997"
                                width="79.32"
                                height="48.502998"/>
                        <rect
                                id="314"
                                class="map__space"
                                x="3.8218451"
                                y="1.6657451"
                                width="117.19388"
                                height="81.257713"/>
                        <rect
                                id="312"
                                class="map__space"
                                x="195.92999"
                                y="1.6085"
                                width="86.544998"
                                height="81.371002"/>
                        <rect
                                id="311"
                                class="map__space"
                                x="282.40707"
                                y="1.556971"
                                width="37.779453"
                                height="81.484856"/>
                        <rect
                                id="309"
                                class="map__space"
                                x="361.27399"
                                y="1.5129144"
                                width="86.283997"
                                height="81.160004"/>
                        <rect
                                id="313"
                                class="map__space"
                                x="121.01572"
                                y="1.700888"
                                width="74.964989"
                                height="81.222572"/>
                        <rect
                                id="308"
                                class="map__space"
                                x="447.55798"
                                y="1.5129144"
                                width="71.398033"
                                height="81.160004"/>
                        <rect
                                id="324"
                                class="map__space"
                                x="620.34381"
                                y="1.5811033"
                                width="101.41222"
                                height="81.400452"/>
                        <rect
                                id="325"
                                class="map__space"
                                x="721.72437"
                                y="1.5494266"
                                width="35.197968"
                                height="81.534286"/>
                        <rect
                                id="330"
                                class="map__space"
                                x="958.89624"
                                y="1.5636107"
                                width="26.77693"
                                height="84.206024"/>
                        <rect
                                id="334"
                                class="map__space"
                                x="1116.869"
                                y="85.306999"
                                width="81.24794"
                                height="45.657619"/>
                        <rect
                                id="302"
                                class="map__space"
                                x="455.37903"
                                y="343.54105"
                                width="79.211967"
                                height="101.72705"/>
                        <rect
                                id="303"
                                class="map__space"
                                x="455.37903"
                                y="237.68765"
                                width="79.187965"
                                height="105.86335"/>
                        <rect
                                id="304"
                                class="map__space"
                                x="455.37903"
                                y="130.99901"
                                width="79.194962"
                                height="106.68862"/>
                        <rect
                                id="331"
                                class="map__space"
                                x="985.6181"
                                y="1.6186664"
                                width="85.905556"
                                height="84.054626"/>
                        <rect
                                id="332"
                                class="map__space"
                                x="1071.5237"
                                y="1.6186664"
                                width="24.759056"
                                height="83.720978"/>
                        <rect
                                id="333"
                                class="map__space"
                                x="1096.2159"
                                y="1.84"
                                width="101.94755"
                                height="83.433014"/>
                        <rect
                                id="310"
                                class="map__space"
                                x="320.14246"
                                y="1.5129144"
                                width="41.131538"
                                height="81.447113"/>
                        <rect
                                id="329"
                                class="map__space"
                                x="912.36975"
                                y="1.6048049"
                                width="46.526485"
                                height="83.816277"/>
                        <rect
                                id="328"
                                class="map__space"
                                x="862.63507"
                                y="1.6048049"
                                width="49.734699"
                                height="83.682289"/>
                        <rect
                                height="35.968201"
                                width="126.50627"
                                y="482.1189"
                                x="1.5972644"
                                class="map__space map__wc map__special"
                                id="320"/>
                        <rect
                                id="300"
                                class="map__space map__wc map__special"
                                x="440.63574"
                                y="482.08002"
                                width="93.241028"
                                height="35.968201"/>
                        <rect
                                height="36.007084"
                                width="35.06221"
                                y="482.08002"
                                x="405.57352"
                                class="map__space "
                                id="301"/>
                        <g
                                id="g16450"
                                transform="matrix(4.191525,0,0,3.487897,2.2529036,33.945748)"
                                class="map__stairs">
                            <path
                                    id="path15769-6"
                                    d="m 0.57649535,118.03263 v 10.40043"/>
                            <path
                                    id="path15769-8-2"
                                    d="m 12.917374,118.11605 v 10.23358"/>
                            <path
                                    id="path15769-7-4"
                                    d="m 17.030284,118.11605 v 10.23358"/>
                            <path
                                    id="path15769-1-3"
                                    d="m 8.8044641,118.11605 v 10.23358"/>
                            <path
                                    id="path15769-15-1"
                                    d="m 4.691554,118.11605 v 10.23358"/>
                        </g>
                        <g
                                class="map__stairs"
                                transform="matrix(3.8227482,0,0,3.5140774,466.45055,30.558561)"
                                id="g18551">
                            <path
                                    d="m 0.57649535,118.03263 v 10.40043"
                                    id="path18541"/>
                            <path
                                    d="m 12.917374,118.11605 v 10.23358"
                                    id="path18543"/>
                            <path
                                    d="m 17.030284,118.11605 v 10.23358"
                                    id="path18545"/>
                            <path
                                    d="m 8.8044641,118.11605 v 10.23358"
                                    id="path18547"/>
                            <path
                                    d="m 4.691554,118.11605 v 10.23358"
                                    id="path18549"/>
                        </g>
                        <rect
                                height="81.347519"
                                width="50.399109"
                                y="1.555869"
                                x="518.99896"
                                class="map__space map__wc_girls map__special"
                                id="321"/>
                        <rect
                                id="323"
                                class="map__space map__wc map__special"
                                x="569.44354"
                                y="1.6013695"
                                width="50.920559"
                                height="81.342422"/>
                        <rect
                                height="20.259796"
                                width="26.391758"
                                y="63.0037"
                                x="555.34125"
                                class="map__space"
                                id="322"/>
                        <g
                                id="g17765"
                                transform="matrix(0,-4.1584077,10.324571,0,-462.57518,75.217813)"
                                class="map__stairs">
                            <path
                                    id="path17755"
                                    d="m 0.57649535,118.03263 v 10.40043"/>
                            <path
                                    id="path17757"
                                    d="m 12.917374,118.11605 v 10.23358"/>
                            <path
                                    id="path17759"
                                    d="m 17.030284,118.11605 v 10.23358"/>
                            <path
                                    id="path17761"
                                    d="m 8.8044641,118.11605 v 10.23358"/>
                            <path
                                    id="path17763"
                                    d="m 4.691554,118.11605 v 10.23358"/>
                        </g>
                        <rect
                                id="307"
                                class="map__space"
                                x="482.71432"
                                y="40.578388"
                                width="35.904377"
                                height="41.757278"/>
                        <path
                                id="path896"
                                d="M 518.99896,82.903389 V 130.97268"
                                class="map__separator"/>
                    </g>
                </svg>
                <canvas class="level__canvas" id="level--3-navigator" width="1200px" height="800px"></canvas>
                <a class="pin target" id="target-3">
							<span class="pin__icon">
									<svg class="icon icon--pin">
										<use xlink:href="#icon-pin"></use>
									</svg>
								</span>
                    <span class="pin-text target-text pin-hidden"></span>
                </a>
                <a class="pin here" id="here-3">
							<span class="pin__icon">
									<svg class="icon icon--pin">
										<use xlink:href="#icon-pin"></use>
									</svg>
								</span>
                    <span class="pin-text here-text pin-hidden">Start
								</span>
                </a>
            </div>
        </div>
        <!-- /levels -->
    </div>
    <!-- /school -->

    <!-- ! - TV version only -->
    <!--<div class="info">
            <div class="minor-info">
                <svg class="icon">
                    <use xlink:href="#icon-key"></use>
                </svg>
                <div class="room"></div>
            </div>
            <div class="teacher">Jméno Příjmení
            </div>
            <div class="minor-info">
                <svg class="icon">
                    <use xlink:href="#icon-footsteps"></use>
                </svg>
                <div class="steps"></div>
            </div>
        </div>-->
    <!-- /info -->

    <div class="mode-list">
        <input class="mode-switch" data-mode="Classrooms" id="map-mode-classrooms" type="radio" name="map-mode" checked="checked" autocomplete="off"/>
        <label class="mode-item" for="map-mode-classrooms">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/>
            </svg>
            <span class="mode-text">Učebny</span>
        </label>

        <input class="mode-switch" data-mode="Navigator" id="map-mode-navigator" type="radio" name="map-mode" autocomplete="off"/>
        <label class="mode-item" for="map-mode-navigator">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M12 7.27l4.28 10.43-3.47-1.53-.81-.36-.81.36-3.47 1.53L12 7.27M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
            </svg>
            <span class="mode-text">Navigace</span>
        </label>

        <input class="mode-switch" data-mode="Staff" id="map-mode-staff" type="radio" name="map-mode" autocomplete="off"/>
        <label class="mode-item" for="map-mode-staff">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 11c1.33 0 4 .67 4 2v.16c-.97 1.12-2.4 1.84-4 1.84s-3.03-.72-4-1.84V13c0-1.33 2.67-2 4-2zm0-1c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 .2C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z"/>
            </svg>
            <span class="mode-text">Zaměstnanci</span>
        </label>
    </div>
    <!-- /mode list -->

    <div class="theme-list">
        <input id="map-color-green" type="radio" name="map-color" checked="checked"/>
        <label class="green" for="map-color-green">
        </label>
        <input id="map-color-red" type="radio" name="map-color"/>
        <label class="red" for="map-color-red">
        </label>
        <input id="map-color-blue" type="radio" name="map-color"/>
        <label class="blue" for="map-color-blue">
        </label>
        <input id="map-color-yellow" type="radio" name="map-color"/>
        <label class="yellow" for="map-color-yellow">
        </label>
    </div>
    <!-- /theme list -->

    <div class="loader"></div>
    <!-- /loader -->

    <span class="classroom-slider-text">Hodina: 1</span>

    <div class="classrooms-selector">
        <div class="info">
            <span class="date">11.1.2001</span> |
            <span class="lesson">1</span><span class="revert" title="Aktuální čas"> |
							<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="510" height="510" viewBox="0 0 510 510">
								<path d="M267.75,12.75c-89.25,0-168.3,48.45-209.1,122.4L0,76.5v165.75h165.75
									l-71.4-71.4c33.15-63.75,96.9-107.1,173.4-107.1C372.3,63.75,459,150.45,459,255s-86.7,191.25-191.25,191.25
									c-84.15,0-153-53.55-181.05-127.5H33.15c28.05,102,122.4,178.5,234.6,178.5C402.9,497.25,510,387.6,510,255
									C510,122.4,400.35,12.75,267.75,12.75z M229.5,140.25V270.3l119.85,71.4l20.4-33.15l-102-61.2v-107.1H229.5z"/>
							</svg>
						</span>
        </div>
        <div class="control">
					<span class="class--icon arrow arrow__back" title="Předchozí den">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: none" viewBox="0 0 24 24">
								<polyline points="14,6 8,12 14,18"/>
							</svg>
						</span>
            <span class="class--icon pause" title="Ovládání cyklovaní zobrazení">
							<svg class="play_button" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 494.148 494.148">
								<path d="M405.284,201.188L130.804,13.28C118.128,4.596,105.356,0,94.74,0C74.216,0,61.52,16.472,61.52,44.044v406.124
								c0,27.54,12.68,43.98,33.156,43.98c10.632,0,23.2-4.6,35.904-13.308l274.608-187.904c17.66-12.104,27.44-28.392,27.44-45.884
								C432.632,229.572,422.964,213.288,405.284,201.188z"/>
							</svg>
							<svg class="pause_button" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 512 512">
								<path d="M181.333,0H74.667c-17.643,0-32,14.357-32,32v448c0,17.643,14.357,32,32,32h106.667c17.643,0,32-14.357,32-32V32
								C213.333,14.357,198.976,0,181.333,0z"/>
								<path d="M437.333,0H330.667c-17.643,0-32,14.357-32,32v448c0,17.643,14.357,32,32,32h106.667c17.643,0,32-14.357,32-32V32
								C469.333,14.357,454.976,0,437.333,0z"/>
							</svg>
							<div class="loader--icon"></div>
						</span>
            <span class="text">1</span>
            <div class="slider">
                <input type="range" min="1" max="10" value="1" class="slider-input">
            </div>
            <span class="text">10</span>
            <span class="class--icon minus">
							<svg viewBox="0 -192 426.66667 426" xmlns="http://www.w3.org/2000/svg">
								<path d="m405.332031 43h-384c-11.773437 0-21.332031-9.558594-21.332031-21.332031 0-11.777344 9.558594-21.335938
								21.332031-21.335938h384c11.777344 0 21.335938 9.558594 21.335938 21.335938 0 11.773437-9.558594 21.332031-21.335938 21.332031zm0 0"/>
							</svg>
						</span>
            <span class="class--icon plus">
							<svg viewBox="0 0 426.66667 426.66667" xmlns="http://www.w3.org/2000/svg">
								<path d="m405.332031 192h-170.664062v-170.667969c0-11.773437-9.558594-21.332031-21.335938-21.332031-11.773437 0-21.332031
								9.558594-21.332031 21.332031v170.667969h-170.667969c-11.773437 0-21.332031 9.558594-21.332031 21.332031 0 11.777344 9.558594
								21.335938 21.332031 21.335938h170.667969v170.664062c0 11.777344 9.558594 21.335938 21.332031 21.335938 11.777344 0 
								21.335938-9.558594 21.335938-21.335938v-170.664062h170.664062c11.777344 0 21.335938-9.558594 21.335938-21.335938 0-11.773437
								-9.558594-21.332031-21.335938-21.332031zm0 0"/>
							</svg>
						</span>
            <input class="view-button" id="map-view" type="checkbox" autocomplete="off"/>
            <label for="map-view" class="class--icon view" title="Zobrazení">
                <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 511.999 511.999">
                    <path d="M508.745,246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818,239.784,3.249,246.035
								c-4.332,5.936-4.332,13.987,0,19.923c4.569,6.257,113.557,153.206,252.748,153.206s248.174-146.95,252.748-153.201
								C513.083,260.028,513.083,251.971,508.745,246.041z M255.997,385.406c-102.529,0-191.33-97.533-217.617-129.418
								c26.253-31.913,114.868-129.395,217.617-129.395c102.524,0,191.319,97.516,217.617,129.418
								C447.361,287.923,358.746,385.406,255.997,385.406z"/>
                    <path d="M255.997,154.725c-55.842,0-101.275,45.433-101.275,101.275s45.433,101.275,101.275,101.275
								s101.275-45.433,101.275-101.275S311.839,154.725,255.997,154.725z M255.997,323.516c-37.23,0-67.516-30.287-67.516-67.516
								s30.287-67.516,67.516-67.516s67.516,30.287,67.516,67.516S293.227,323.516,255.997,323.516z"/>
                </svg>
            </label>
            <div class="view-selection">
                <input id="map-view-subject" type="radio" name="map-view" checked="checked" autocomplete="off"/>
                <label for="map-view-subject">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 514.56 514.56">
                        <path d="M499.2,335.967h-12.8V51.807c0-12.8-10.24-23.04-25.6-23.04H284.16l-2.56-10.24c-2.56-10.24-12.8-17.92-25.6-17.92
									s-20.48,5.12-25.6,17.92l-2.56,10.24H51.2c-15.36,0-25.6,10.24-25.6,23.04v284.16H12.8c-7.68,0-12.8,5.12-12.8,12.8v25.6
									c0,7.68,5.12,12.8,12.8,12.8h97.28l-30.72,94.72c-5.12,12.8,5.12,28.16,17.92,30.72c12.8,5.12,28.16-5.12,30.72-17.92
									l35.84-110.08h186.88l35.84,110.08c7.68,23.04,28.16,17.92,30.72,17.92c12.8-5.12,20.48-17.92,17.92-30.72l-30.72-94.72h97.28
									c7.68,0,12.8-5.12,12.8-12.8v-25.6C512,341.087,506.88,335.967,499.2,335.967z M332.8,259.167H102.4
									c-15.36,0-25.6-10.24-25.6-25.6c0-15.36,10.24-25.6,25.6-25.6h230.4c15.36,0,25.6,10.24,25.6,25.6
									C358.4,246.367,345.6,259.167,332.8,259.167z M409.6,156.767H102.4c-15.36,0-25.6-10.24-25.6-25.6s10.24-25.6,25.6-25.6h307.2
									c15.36,0,25.6,10.24,25.6,25.6C435.2,143.967,422.4,156.767,409.6,156.767z"/>
                    </svg>
                    <span>Předměty</span>
                </label>

                <input id="map-view-staff" type="radio" name="map-view" autocomplete="off"/>
                <label for="map-view-staff">
                    <svg viewBox="-42 0 512 512.002" xmlns="http://www.w3.org/2000/svg">
                        <path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687
										36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094
										-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 
										36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"/>
                        <path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907
										-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19
										-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407
										-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938
										-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656
										0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782
										-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813
										4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157
										-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031
										22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 
										64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625
										-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/>
                    </svg>
                    <span>Učitelé</span>
                </label>

                <input id="map-view-classes" type="radio" name="map-view" autocomplete="off"/>
                <label for="map-view-classes">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" style="stroke: none" viewBox="0 0 31.99 31.99">
                        <ellipse cx="6.737" cy="22.946" rx="2.711" ry="2.664"/>
                        <polygon points="6.782,27.188 5.751,26.011 3.358,26.439 3.358,31.195 4.211,31.195 4.253,31.99 9.148,31.99 9.189,31.195
										9.827,31.195 9.827,26.439 7.783,26.011"/>
                        <ellipse cx="15.848" cy="22.821" rx="2.709" ry="2.663"/>
                        <polygon points="15.892,27.061 14.862,25.884 12.469,26.314 12.469,31.068 13.322,31.068 13.364,31.864 18.259,31.864
										18.3,31.068 18.937,31.068 18.937,26.314 16.894,25.884"/>
                        <ellipse cx="24.711" cy="22.819" rx="2.711" ry="2.664"/>
                        <polygon points="24.756,27.061 23.726,25.884 21.332,26.314 21.332,31.068 22.185,31.068 22.228,31.864 27.122,31.864
										27.163,31.068 27.8,31.068 27.8,26.314 25.757,25.884"/>
                        <ellipse cx="11.632" cy="12.452" rx="2.174" ry="2.136"/>
                        <polygon points="9.641,19.703 13.565,19.703 13.599,19.064 14.109,19.064 14.109,15.253 12.47,14.908 11.668,15.852
										10.842,14.908 8.924,15.253 8.924,19.064 9.607,19.064"/>
                        <ellipse cx="20.743" cy="12.351" rx="2.173" ry="2.135"/>
                        <polygon points="20.779,15.751 19.953,14.808 18.035,15.151 18.035,18.966 18.718,18.966 18.752,19.602 22.677,19.602
										22.709,18.966 23.22,18.966 23.22,15.151 21.582,14.808"/>
                        <ellipse cx="27.849" cy="12.351" rx="2.174" ry="2.135"/>
                        <polygon points="28.688,14.808 27.886,15.751 27.06,14.808 25.142,15.151 25.142,18.966 25.825,18.966 25.858,19.602
										29.783,19.602 29.815,18.966 30.327,18.966 30.327,15.151"/>
                        <ellipse cx="4.372" cy="12.35" rx="2.173" ry="2.135"/>
                        <polygon points="6.338,18.965 6.849,18.965 6.849,15.151 5.21,14.806 4.408,15.75 3.582,14.806 1.663,15.151 1.663,18.965
										2.347,18.965 2.381,19.602 6.306,19.602"/>
                        <circle cx="15.967" cy="2.311" r="2.311"/>
                        <polygon points="13.914,10.216 18.081,10.216 18.289,6.167 22.415,4.801 22.06,3.721 18.29,4.968 16.808,4.968 15.928,5.989
										15.075,4.968 13.213,5.25 13.084,9.469 13.877,9.469"/>
                    </svg>
                    <span>Třídy</span>
                </label>
            </div>
            <span class="class--icon arrow arrow__forward" title="Následující den">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: none" viewBox="0 0 24 24">
								<polyline points="10,6 17,12 10,18"/>
							</svg>
						</span>
        </div>
    </div>
    <!-- /classrooms setter -->

    <div class="navigator">
        <!--<span class="input-label">Navigace</span>-->
        <input type="number" max=999 min=0 placeholder="Start" class="input-start" title="Počáteční místnost navigace">
        <input type="number" max=999 min=0 placeholder="Cíl" class="input-target" title="Cílová místnost navigace">
        <input type="button" value="Navigovat" class="input-button" onclick="start()">
    </div>
    <div class="navigator-detail">
        <div title="Vzdálenost mezi body navigace">
            <svg class="icon">
                <use xlink:href="#icon-distance"></use>
            </svg>
            <span class="navigator-distance">0</span> m
        </div>
        <div title="Kroky potřebné k ujítí vzdálenosti mezi body navigace">
            <svg class="icon">
                <use xlink:href="#icon-footsteps"></use>
            </svg>
            <span class="navigator-steps">0</span>
        </div>
        <div title="Čas potřebný k ujítí vzdálenosti mezi body navigace">
            <svg class="icon">
                <use xlink:href="#icon-time"></use>
            </svg>
            <span class="navigator-time">0</span> s
        </div>
        <span class="clear">X</span>
    </div>
    <!-- /navigator box -->

    <div class="list-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: none" viewBox="0 0 24 24">
            <polyline points="14,6 8,12 14,18"/>
        </svg>
    </div>

    <div class="list-panel">
        <input type="search" class="search" maxlength="25" placeholder="Hledat...">
        <div class="list-places">
            <ul class="list">
            </ul>
        </div>
    </div>
    <!-- /list panel -->
</div>
<!-- /map -->


<script src="json/map2.js"></script>
<script src="json/map_nodes.js"></script>

<script src="js/map-handler.js"></script>
<script src="js/node-map.js"></script>
<script src="js/djikstra.js"></script>
<script src="js/navigation.js"></script>

<script src="js/classrooms.js"></script>

<script src="js/staff.js"></script>
<script src="js/api.js"></script>

<script src="js/main.js"></script>

<?php
include "mysql.php";
$mysqli = openMySql();

$stmt = $mysqli->prepare("CREATE TABLE IF NOT EXISTS map_views (id int PRIMARY KEY AUTO_INCREMENT, time DATETIME DEFAULT CURRENT_TIMESTAMP, ip VARCHAR(40), info VARCHAR(1024))");
$stmt->execute();
$stmt->close();

$stmt2 = $mysqli->prepare("INSERT INTO map_views (ip, info) VALUES (?, ?)");
$stmt2->bind_param("ss", $_SERVER['REMOTE_ADDR'], $_SERVER['HTTP_USER_AGENT']);
$stmt2->execute();
$stmt2->close();

closeMySql($mysqli);
?>
</body>
</html>