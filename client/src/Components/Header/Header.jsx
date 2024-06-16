import styles from './Header.module.css';

const Header = () => {

    return (
        <div className={styles.Container}>
            <div className={styles.TitleContainer}>
                <h1>STATISTIX</h1>
                <p>Это просто</p>
            </div>
            <div className={styles.LinesContainer}>
                <button className={styles.Button}>
                    <p>Начать</p>
                </button>
                <svg className={styles.Lines} width="1920" height="227" viewBox="0 0 1920 227" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_11_90)">
                        <path d="M-0.5 98H691.5L748.139 103.772C762.457 105.231 776.905 102.868 790.012 96.9226V96.9226C808.35 88.6042 829.121 87.3794 848.31 93.4849L862.5 98H1062L1078.1 92.8786C1096.03 87.1726 1115.46 88.4749 1132.47 96.5232V96.5232C1145.54 102.707 1160.13 104.948 1174.45 102.972L1210.5 98H1918.5" stroke="url(#paint0_radial_11_90)" stroke-width="2" shape-rendering="crispEdges"/>
                    </g>
                    <g filter="url(#filter1_d_11_90)">
                        <path d="M1 139H507.765C532.504 139 556.496 130.517 575.737 114.966V114.966C602.888 93.0219 638.963 85.5355 672.604 94.8636L718.259 107.523C763.63 120.104 811.983 116.294 854.824 96.7641L856.5 96H1062L1077.92 103.204C1111.63 118.46 1149.97 119.934 1184.75 107.31L1205.75 99.6897C1239.42 87.4697 1277.03 93.7628 1304.89 116.278V116.278C1323.08 130.98 1345.76 139 1369.15 139H1920" stroke="url(#paint1_radial_11_90)" stroke-width="2" shape-rendering="crispEdges"/>
                    </g>
                    <g filter="url(#filter2_d_11_90)">
                        <path d="M0 179H485.533C522.182 179 555.895 158.951 573.394 126.75L581.84 111.208C611.001 57.544 684.721 49.3865 724.91 95.3759V95.3759C758.623 133.955 818.091 135.535 853.805 98.8003L857.5 95H1059.5L1070.76 106.583C1101.42 138.12 1153.12 134.37 1178.9 98.7373V98.7373C1210.68 54.8277 1277.99 61.4402 1300.62 110.694L1309.66 130.377C1323.28 160.009 1352.9 179 1385.51 179H1919" stroke="url(#paint2_radial_11_90)" stroke-width="2" shape-rendering="crispEdges"/>
                    </g>
                    <g filter="url(#filter3_d_11_90)">
                        <path d="M1 56H500.8C529.784 56 557.627 67.3036 578.408 87.5083V87.5083C612.795 120.94 664.727 128.594 707.296 106.504L725.725 96.9419C761.206 78.5307 802.861 76.1511 840.208 90.4019L857.5 97H1060L1082.25 88.0387C1113.43 75.4794 1148.78 78.9204 1176.95 97.2578L1180.46 99.5422C1219.7 125.081 1271.53 119.281 1304.15 85.6994V85.6994C1322.59 66.7131 1347.94 56 1374.41 56H1920" stroke="url(#paint3_radial_11_90)" stroke-width="2" shape-rendering="crispEdges"/>
                    </g>
                    <g filter="url(#filter4_d_11_90)">
                        <path d="M0 12H483.716C521.531 12 556.365 32.5332 574.678 65.619L598.636 108.905C627.337 160.76 701.685 161.335 731.185 109.931V109.931C756.073 66.5633 815.315 58.5861 850.788 93.8261L856.5 99.5H1058.5L1068.25 89.3477C1100.39 55.88 1155.29 60.9286 1180.78 99.6962V99.6962C1214.27 150.622 1291.88 139.783 1310.14 81.6307L1314.56 67.5397C1324.94 34.4887 1355.57 12 1390.21 12H1919" stroke="url(#paint4_radial_11_90)" stroke-width="2" shape-rendering="crispEdges"/>
                    </g>
                    <defs>
                        <filter id="filter0_d_11_90" x="-4.5" y="84.3764" width="1927" height="24.8151" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset/>
                            <feGaussianBlur stdDeviation="2"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0.629119 0 0 0 0 1 0 0 0 0 0.732966 0 0 0 1 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11_90"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11_90" result="shape"/>
                        </filter>
                        <filter id="filter1_d_11_90" x="-3" y="85.9305" width="1927" height="58.0695" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset/>
                            <feGaussianBlur stdDeviation="2"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.962912 0 0 0 0 0.629119 0 0 0 1 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11_90"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11_90" result="shape"/>
                        </filter>
                        <filter id="filter2_d_11_90" x="-4" y="60.3823" width="1927" height="123.618" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset/>
                            <feGaussianBlur stdDeviation="2"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.467067 0 0 0 0 0.467067 0 0 0 1 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11_90"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11_90" result="shape"/>
                        </filter>
                        <filter id="filter3_d_11_90" x="-3" y="51" width="1927" height="73.0192" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset/>
                            <feGaussianBlur stdDeviation="2"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0.629119 0 0 0 0 0.977747 0 0 0 0 1 0 0 0 1 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11_90"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11_90" result="shape"/>
                        </filter>
                        <filter id="filter4_d_11_90" x="-4" y="7" width="1927" height="146.142" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset/>
                            <feGaussianBlur stdDeviation="2"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0.327574 0 0 0 0 0.159467 0 0 0 0 1 0 0 0 1 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11_90"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11_90" result="shape"/>
                        </filter>
                        <radialGradient id="paint0_radial_11_90" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(959 95.5) scale(960 30.2906)">
                            <stop stop-color="#A0FFBB" stop-opacity="0.3"/>
                            <stop offset="1" stop-color="#A0FFBB"/>
                        </radialGradient>
                        <radialGradient id="paint1_radial_11_90" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(960.5 110.841) scale(960 81.2338)">
                            <stop stop-color="#FFF6A0" stop-opacity="0.3"/>
                            <stop offset="1" stop-color="#FFF6A0"/>
                        </radialGradient>
                        <radialGradient id="paint2_radial_11_90" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(959.5 93.8068) scale(960 245.767)">
                            <stop stop-color="#FF7777" stop-opacity="0.3"/>
                            <stop offset="1" stop-color="#FF7777"/>
                        </radialGradient>
                        <radialGradient id="paint3_radial_11_90" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(960.5 101.739) scale(960 120.474)">
                            <stop stop-color="#A0F9FF" stop-opacity="0.3"/>
                            <stop offset="1" stop-color="#A0F9FF"/>
                        </radialGradient>
                        <radialGradient id="paint4_radial_11_90" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(959.5 124.386) scale(960 296.021)">
                            <stop stop-color="#B3A0FF" stop-opacity="0.3"/>
                            <stop offset="1" stop-color="#B3A0FF"/>
                        </radialGradient>
                    </defs>
                </svg>
            </div>
        </div>
    )

}

export default Header;