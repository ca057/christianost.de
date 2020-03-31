---
title: "React Native Resources"
date: 2020-03-31T10:09:05+02:00
draft: true
---

This is a growing list of resources around developing apps with React Native.

## Testing

### Test runners

- [Jest](https://jestjs.io/docs/en/tutorial-react-native): _"Jest is a delightful JavaScript Testing Framework with a focus on simplicity."_
  - Supports snapshot testing out of the box.
  - Can be used to run both unit and acceptance tests (e.g. with [Detox](#acceptance/integration-testing))

### Unit/Component testing

- [Native Testing Library](https://www.native-testing-library.com/): _"Simple and complete React Native testing utilities that encourage good testing practices"_
  - Implementation of [Testing Library](https://testing-library.com) for React Native.
- [Using enzyme to Test Components in React Native](https://github.com/enzymejs/enzyme/blob/master/docs/guides/react-native.md): _"Enzyme is a JavaScript Testing utility for React that makes it easier to test your React Components' output."_
  - Needs an adapter for React and an emulated DOM like [JSDOM](https://github.com/jsdom/jsdom).

### Acceptance/Integration testing

- [Detox](https://github.com/wix/detox): _"Gray box[^gbt] end-to-end testing and automation library for mobile apps."_
  - Supports RN projects and pure native ones.
  - Works on iOS & Android on Simulator and on real devices on Android.
  - Used by the RN team.
- [Cavy](https://cavy.app): _"Cavy is a cross-platform, integration test framework for React Native, by [Pixie Labs](https://pixielabs.io/)."_
- [Appium](https://appium.io): _"Appium is an open source test automation framework for use with native, hybrid and mobile web apps. "_

## UI development

- [Storybook for React Native](https://storybook.js.org/docs/guides/guide-react-native/): _"Storybook is a user interface development environment and playground for UI components."_

## Developer tools

- [React Native Debugger](https://github.com/jhen0409/react-native-debugger): _"The standalone app based on official debugger of React Native, and includes React Inspector / Redux DevTools"_
- [Flipper](https://fbflipper.com/): _"Flipper is a platform for debugging iOS, Android and React Native apps."_

<!-- footnotes -->

[^gbt]: According to Wikipedia, in gray-box testing is a combination of white-box (detailed insights into the SUT) and black-box (only high-level understanding of SUT) testing. This means, the tester has some information about the internals of the application to test.
