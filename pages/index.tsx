import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import Image from "next/image";
import LagrangeMobileLogo from "../public/Lagrange_new_logo-05.png";
const Index: NextPage = (props) => {
  const [isExpanded, toggleExpansion] = useState(true);

  return (
    <header className="relative flex items-center justify-center h-screen overflow-hidden">
      <Head>
        <title>Lagrange.fi - Homepage</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="z-40 w-full h-screen p-10 bg-cover sm:p-5 xs:p-2">
        <div className="flex items-center justify-between">
          <div className="xxl:w-96 xl:w-96 md:w-96 sm:w-96 xs:w-40">
            <Image
              className="cursor-pointer"
              src={LagrangeMobileLogo}
              width={202}
              height={83}
              alt="Logo"
            />
          </div>

          <div className="flex items-center text-white">
            <p className=" mr-9 xxl:r-9 xl:r-9 lg:mr-9 md:mr-9 sm:mr-9 xs:mr-0">
              <a
                href="https://www.youtube.com/watch?v=7Pa9LKa_IQM"
                target="_blank"
                rel="noreferrer"
              >
                <p className="text-base font-normal font-display xs:text-sm sm:text-lg">
                  Demo Video
                </p>
              </a>
            </p>
            <p className="mr-2 xxl:ml-9 xl:ml-9 lg:ml-9 mdl:ml-9 sm:ml-9 xs:ml-2 xs:mr-0">
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
              >
                <p className="text-base font-normal font-display xs:text-sm sm:text-lg">
                  Pitchdeck
                </p>
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="h-full ml-12 mt-36 sm:mt-16 sm:ml-12 xs:ml-2">
            <div className=" leading-[3.5rem] xs:leading-[2.5rem] font-normal text-white  xxl:text-lagrange xl:text-lagrange lg:text-lagrange md:text-lagrange sm:text-lagrangesmallscreen xs:text-xl font-display">
              <p className="font-normal">
                <span className="font-medium">Lagrange </span>
                offers a fully decentralized
              </p>
              <p className="mt-2">24/7 FX market that does not require</p>
              <p className="mt-2">any broker or settlement periods.</p>
            </div>
            <div className="mt-8">
              <Link href="/swap">
                <a>
                  <button className="w-48 text-white rounded sm:w-48 xs:w-36 h-14 bg-gradient-to-b from-lagrange-buttonpro-blue to-lagrange-buttonpro-purple">
                    <p className="text-4xl font-normal font-display ">LITE</p>
                  </button>
                </a>
              </Link>

              <a>
                <button className="w-48 ml-4 text-white border-2 rounded font-display sm:w-40 xs:w-36 h-14 border-lagrange-buttonpro-blue">
                  <p className="text-4xl font-normal font-display">
                    PRO <span className="text-xs FONT-B">SOON</span>
                  </p>{" "}
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className=" h-96"></div>

        <div className="flex items-end justify-center h-24 mt-8 p-72 xs:p-10 ">
          <div className="mr-8">
            <a
              href="https://devpost.com/software/lagrange"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="32"
                height="28"
                viewBox="0 0 32 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.00267 0L0 13.8587L8.00267 27.7067H23.9973L32 13.8587L23.9973 0H8.00267ZM10.1267 5.44533H15.3893C20.196 5.44533 23.7573 7.70533 23.7573 13.8587C23.7573 19.7733 19.4773 22.2613 15.1493 22.2613H10.1267V5.44533ZM13.4827 8.71067V18.996H15.1373C18.6653 18.996 20.2867 16.9293 20.2867 13.848C20.2987 10.4227 18.8253 8.71067 15.264 8.71067H13.4827Z"
                  fill="#BCBCBC"
                />
              </svg>
            </a>
          </div>
          <div className="mr-8">
            <a
              href="https://discord.gg/8rDcX2SQ"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="32"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27.0892 1.99054C25.0492 1.07057 22.8626 0.390589 20.576 0.00393344C20.5557 2.41084e-05 20.5346 0.00254342 20.5157 0.011143C20.4969 0.0197426 20.4811 0.033997 20.4707 0.0519321C20.1907 0.543918 19.8787 1.18523 19.6601 1.69188C17.2349 1.32954 14.7694 1.32954 12.3443 1.69188C12.1007 1.13038 11.8261 0.582882 11.5216 0.0519321C11.5113 0.0337762 11.4957 0.0191993 11.4769 0.0101468C11.4581 0.00109419 11.4369 -0.0020037 11.4163 0.00126673C9.13104 0.387922 6.94444 1.0679 4.90317 1.98921C4.8856 1.99658 4.87072 2.00914 4.8605 2.02521C0.711287 8.12503 -0.426013 14.0742 0.132637 19.9487C0.134192 19.9631 0.138658 19.977 0.145763 19.9896C0.152869 20.0022 0.162466 20.0132 0.173969 20.022C2.59576 21.7852 5.29694 23.1284 8.1644 23.9952C8.18439 24.0014 8.20577 24.0014 8.22575 23.9952C8.24573 23.989 8.26338 23.9769 8.2764 23.9606C8.89238 23.1339 9.4417 22.2606 9.91102 21.3433C9.93902 21.29 9.91235 21.226 9.85636 21.2047C8.99505 20.8803 8.16052 20.4889 7.36043 20.034C7.34605 20.0258 7.33394 20.0142 7.32517 20.0001C7.31641 19.9861 7.31126 19.9701 7.31021 19.9536C7.30915 19.937 7.31221 19.9205 7.31911 19.9055C7.32602 19.8904 7.33655 19.8773 7.34976 19.8674C7.51776 19.7434 7.68575 19.614 7.84575 19.4847C7.86015 19.4731 7.8775 19.4657 7.89586 19.4633C7.91422 19.461 7.93287 19.4637 7.94974 19.4714C13.1856 21.8233 18.8561 21.8233 24.0306 19.4714C24.0475 19.4633 24.0664 19.4601 24.085 19.4623C24.1036 19.4644 24.1213 19.4717 24.1359 19.4834C24.2959 19.614 24.4626 19.7434 24.6319 19.8674C24.6453 19.8771 24.656 19.89 24.6631 19.905C24.6702 19.9199 24.6735 19.9363 24.6727 19.9528C24.672 19.9694 24.6671 19.9854 24.6586 19.9996C24.65 20.0137 24.6381 20.0256 24.6239 20.034C23.8266 20.4927 22.9973 20.8807 22.1267 21.2033C22.1133 21.2082 22.1011 21.2158 22.0909 21.2258C22.0808 21.2357 22.0728 21.2477 22.0676 21.2609C22.0625 21.2742 22.0602 21.2884 22.0609 21.3026C22.0617 21.3168 22.0655 21.3307 22.072 21.3433C22.552 22.2593 23.1013 23.1313 23.7053 23.9592C23.7178 23.9762 23.7353 23.9889 23.7554 23.9956C23.7754 24.0023 23.797 24.0026 23.8173 23.9966C26.6897 23.1321 29.3953 21.7883 31.8197 20.022C31.8315 20.0138 31.8415 20.003 31.8488 19.9906C31.8562 19.9782 31.8608 19.9644 31.8624 19.95C32.529 13.1582 30.7451 7.25706 27.1305 2.02787C27.1217 2.01088 27.107 1.99763 27.0892 1.99054ZM10.6937 16.3715C9.11771 16.3715 7.81775 14.9462 7.81775 13.1982C7.81775 11.4489 9.09238 10.025 10.6937 10.025C12.307 10.025 13.5949 11.4609 13.5696 13.1982C13.5696 14.9475 12.295 16.3715 10.6937 16.3715V16.3715ZM21.3267 16.3715C19.7494 16.3715 18.4508 14.9462 18.4508 13.1982C18.4508 11.4489 19.7241 10.025 21.3267 10.025C22.94 10.025 24.2279 11.4609 24.2026 13.1982C24.2026 14.9475 22.9413 16.3715 21.3267 16.3715V16.3715Z"
                  fill="#BCBCBC"
                />
              </svg>
            </a>
          </div>
          <div className="mr-8">
            <a href="https://t.me/lagrange_fi" target="_blank" rel="noreferrer">
              <svg
                width="32"
                height="27"
                viewBox="0 0 32 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M29.8401 0.176462L1.4942 11.1071C-0.440286 11.8841 -0.429094 12.9633 1.13928 13.4445L8.41679 15.7147L25.2548 5.09102C26.051 4.6066 26.7784 4.8672 26.1805 5.39798L12.5384 17.71H12.5352L12.5384 17.7116L12.0364 25.2129C12.7718 25.2129 13.0963 24.8756 13.5088 24.4775L17.0436 21.0402L24.3963 26.4711C25.752 27.2177 26.7257 26.834 27.063 25.2161L31.8896 2.46907C32.3837 0.488218 31.1334 -0.408681 29.8401 0.176462Z"
                  fill="#BCBCBC"
                />
              </svg>
            </a>
          </div>
          <div className="mr-8">
            <a
              href="https://twitter.com/Lagrange_fi"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="32"
                height="27"
                viewBox="0 0 32 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 3.08573C30.8232 3.60718 29.5591 3.95951 28.2301 4.11876C29.6013 3.29824 30.6272 2.00685 31.1164 0.485536C29.828 1.25078 28.418 1.78943 26.9476 2.07807C25.9588 1.0223 24.6491 0.322515 23.2218 0.0873671C21.7945 -0.147781 20.3296 0.0948611 19.0543 0.777622C17.7791 1.46038 16.7649 2.54506 16.1693 3.86326C15.5737 5.18145 15.43 6.65941 15.7604 8.06767C13.1499 7.9366 10.5961 7.25809 8.26485 6.07617C5.93354 4.89425 3.87681 3.23535 2.22813 1.20711C1.66441 2.17954 1.34026 3.30699 1.34026 4.50773C1.33963 5.58867 1.60582 6.65306 2.11522 7.60645C2.62461 8.55984 3.36145 9.37276 4.26037 9.97307C3.21786 9.9399 2.19836 9.65821 1.28671 9.15144V9.236C1.2866 10.7521 1.81102 12.2215 2.77098 13.3949C3.73094 14.5683 5.06731 15.3735 6.55333 15.6738C5.58624 15.9355 4.57231 15.9741 3.58813 15.7865C4.0074 17.091 4.82409 18.2317 5.92389 19.049C7.02368 19.8662 8.35151 20.3191 9.72148 20.3443C7.39587 22.1699 4.52376 23.1602 1.56716 23.1558C1.04343 23.156 0.520146 23.1254 0 23.0642C3.00111 24.9938 6.49462 26.0179 10.0625 26.0139C22.1404 26.0139 28.7431 16.0106 28.7431 7.33483C28.7431 7.05296 28.736 6.76828 28.7233 6.48642C30.0076 5.55764 31.1162 4.40752 31.9972 3.08996L32 3.08573Z"
                  fill="#BCBCBC"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <video
        autoPlay
        loop
        muted
        className="absolute z-10 w-auto min-w-full min-h-full max-w-none"
      >
        <source
          src="https://relaxed-newton-b77a1a.netlify.app/Earth.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </header>
  );
};

export default Index;
