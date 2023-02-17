// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

Enzyme.configure({ adapter: new Adapter() });

/* eslint-disable global-require */
if (typeof window !== "undefined") {
    global.window.resizeTo = (width, height) => {
        global.window.innerWidth = width || global.window.innerWidth;
        global.window.innerHeight = height || global.window.innerHeight;
        global.window.dispatchEvent(new Event("resize"));
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    global.window.scrollTo = () => {};
    // ref: https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
    if (!window.matchMedia) {
        Object.defineProperty(global.window, "matchMedia", {
            value: jest.fn((query) => ({
                matches: query.includes("max-width"),
                addListener: jest.fn(),
                removeListener: jest.fn(),
            })),
        });
    }

    // Fix css-animation or rc-motion deps on these
    // https://github.com/react-component/motion/blob/9c04ef1a210a4f3246c9becba6e33ea945e00669/src/util/motion.ts#L27-L35
    // https://github.com/yiminghe/css-animation/blob/a5986d73fd7dfce75665337f39b91483d63a4c8c/src/Event.js#L44
    window.AnimationEvent = window.AnimationEvent || (() => {});
    window.TransitionEvent = window.TransitionEvent || (() => {});
}
