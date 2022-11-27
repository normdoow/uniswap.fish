import React from "react";
import { useEffect, useRef, useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import styled, { keyframes } from "styled-components";
import { ANNOUNCEMENTS } from "./announcement.setting";

const bubbleAnimation = keyframes`
  20% {
    opacity: 1;
    transform: scale(1) translateX(1px) translateY(-10px);
  }
  80% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    transform: scale(0.75) translateX(5px) translateY(-20px);
  }
`;
const smallBubbleAnimation = keyframes`
  20% {
    opacity: 1;
    transform: scale(1) translateX(-2.5px) translateY(-10px);
  }
  45% {
    opacity: 0.5;
  }
  65% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    transform: scale(0.75) translateX(-5px) translateY(-20px);
  }
`;
const insideBubbleAnimation = keyframes`
  0% {
    transform: scale(0);
    background: rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(1);
    background: rgba(0, 0, 0, 1);
  }
`;
const badgeAnimation = keyframes`
  0% {
    transform: scale(0);
    background: #f73c01;
  }
  100% {
    transform: scale(3);
    background: transparent;
  }
`;
const WhatsNewContainer = styled.div`
  position: relative;
`;
const WhatsNew = styled.a`
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;

  &:hover {
    color: white;
  }

  & > span.badge {
    background: #f73c01;
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: absolute;
    top: -2px;
    right: -8px;
    z-index: 9999;
  }
  & > span.bubble {
    position: absolute;
    top: -3px;
    right: 0.5px;
    z-index: 99999;
    transform-origin: 2.5px 7px;

    /* Rotation Transform Origin Debug */
    /* &::before {
      content: "";
      position: absolute;
      background: white;
      height: 12px;
      width: 1px;
      top: -5.5px;
      left: -18px;
      transform: translateX(20px);
    } */

    & > span:nth-child(1) {
      width: 3px;
      height: 3px;
      border-radius: 40%;
      display: block;
      position: absolute;
      background: #f73c01;
      opacity: 0;

      animation-delay: 0.2s;
      animation-name: ${smallBubbleAnimation};
      animation-duration: 1s;
      animation-iteration-count: 1;
      animation-timing-function: ease-out;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;
    }

    & > span:nth-child(2) {
      width: 5px;
      height: 5px;
      border-radius: 40%;
      display: block;
      background: #f73c01;
      position: absolute;
      transform: translateX(2px) translateY(-1px);
      opacity: 0;

      animation-delay: 0.2s;
      animation-name: ${bubbleAnimation};
      animation-duration: 1s;
      animation-iteration-count: 1;
      animation-timing-function: ease-out;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;
    }
  }
  & > span.insideBubble::before {
    content: "";
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: absolute;

    animation-name: ${insideBubbleAnimation};
    animation-duration: 0.2s;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }
  & > span.animatedBadge {
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: absolute;
    top: -2px;
    right: -8px;

    animation-name: ${badgeAnimation};
    animation-duration: 1.25s;
    animation-iteration-count: infinite;
    animation-fill-mode: forwards;
  }
  & > span.disabled {
    display: none;
  }
`;
const animatedContainerAnimation = keyframes`
  100% {
    opacity: 1;
    margin-top: 0;
  }
`;
const whatsNewPopupOpenAnimation = keyframes`
  0% {
    transform: translateY(-40px) rotate3d(1, 0, 0.075, 30deg);
    opacity: 0;
  }
`;
const WhatsNewPopup = styled.div`
  position: absolute;
  background: white;
  border-radius: 8px;
  width: 320px;
  height: 450px;
  left: calc(-320px + 87.07px);
  overflow-y: scroll;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);

  // use this instead of display: none to preload iframe
  top: -1000px;

  & div.item {
    padding: 0 10px;
    border-bottom: 1px solid #eee;
  }

  & > div.animatedContainer {
    margin-top: 30px;
    opacity: 0;

    animation-name: ${animatedContainerAnimation};
    animation-duration: 0.5s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  &.opened {
    top: 40px;

    animation-name: ${whatsNewPopupOpenAnimation};
    animation-duration: 0.4s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }
`;

const Tag = styled.div`
  font-size: 0.8rem;
  color: white;
  display: inline-block;
  margin-top: 10px;
  border-radius: 5rem;
  padding: 2px 7px;
  font-weight: bold;
  cursor: pointer;
`;
const FeatureUpdateTag = () => (
  <Tag style={{ background: "#7856ff" }}>Feature Update</Tag>
);
const AchievementTag = () => (
  <Tag style={{ background: "#ff7900" }}>Achievement</Tag>
);
const AnnouncementTag = () => (
  <Tag style={{ background: "#f81980" }}>Announcement</Tag>
);

const announcementTrackerValue = `${ANNOUNCEMENTS[0].tag}_${ANNOUNCEMENTS[0].tweetId}_${ANNOUNCEMENTS[0].message}`;

const Announcement = () => {
  const [isOpenWhatsNewPopup, setIsOpenWhatsNewPopup] = useState(false);
  const [playBubbleBurstAnimation, setPlayBubbleBurstAnimation] =
    useState(false);
  const [displayBadge, setDisplayBadge] = useState(false);
  const animatedBadgeRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (localStorage.getItem("announcement") !== announcementTrackerValue) {
      setDisplayBadge(true);
    }
  }, [setDisplayBadge]);

  useEffect(() => {
    badgeRef.current?.addEventListener("animationend", () => {
      badgeRef.current?.classList.add("disabled");
    });

    document.addEventListener("click", ({ target }) => {
      if (target && !(target as Element).closest("#menubar-container")) {
        if (isOpenWhatsNewPopup) {
          setIsOpenWhatsNewPopup(false);
        }
      }
    });
  }, [playBubbleBurstAnimation, isOpenWhatsNewPopup]);

  return (
    <WhatsNewContainer>
      <WhatsNewPopup className={`${isOpenWhatsNewPopup ? "opened" : ""}`}>
        <div className={`${isOpenWhatsNewPopup ? "animatedContainer" : ""}`}>
          {ANNOUNCEMENTS.map((announcement) => {
            return (
              <div
                key={`announcement_${announcement.tweetId}`}
                className="item"
              >
                {announcement.tag === "achievement" && <AchievementTag />}
                {announcement.tag === "feature-update" && <FeatureUpdateTag />}
                {announcement.tag === "announcement" && <AnnouncementTag />}
                <TwitterTweetEmbed tweetId={announcement.tweetId} />
              </div>
            );
          })}
        </div>
      </WhatsNewPopup>

      <WhatsNew
        style={{
          color: displayBadge && !playBubbleBurstAnimation ? "white" : "",
        }}
        onClick={() => {
          setIsOpenWhatsNewPopup(!isOpenWhatsNewPopup);
          setPlayBubbleBurstAnimation(true);

          if (
            localStorage.getItem("announcement") !== announcementTrackerValue
          ) {
            localStorage.setItem("announcement", announcementTrackerValue);
            const props = {
              trackingId: announcementTrackerValue,
              ...ANNOUNCEMENTS[0],
            };
            window.plausible("Announcement", {
              props,
            });
          }
        }}
      >
        What's New
        {displayBadge && playBubbleBurstAnimation && (
          <>
            {Array.from(Array(6).keys()).map((_, i) => {
              return (
                <span
                  key={`bubble_${i}`}
                  className="bubble"
                  style={{
                    transform: `rotate(${i * 60}deg)`,
                  }}
                >
                  <span />
                  <span />
                </span>
              );
            })}
          </>
        )}
        {displayBadge && (
          <>
            <span
              ref={badgeRef}
              className={`badge ${
                playBubbleBurstAnimation ? "insideBubble" : ""
              }`}
            />
            <span
              ref={animatedBadgeRef}
              className={`animatedBadge ${
                playBubbleBurstAnimation ? "disabled" : ""
              }`}
            />
          </>
        )}
      </WhatsNew>
    </WhatsNewContainer>
  );
};

export default Announcement;
