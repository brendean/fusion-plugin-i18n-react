/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import type {Context} from 'fusion-core';

type TranslateType = (
  key: string,
  interpolations?: {[string]: string | number}
) => string;

type InjectedPropsType = {|
  translate: TranslateType,
|};

const createTranslate = (context: Context) => {
  const {i18n} = context;
  return i18n
    ? (key: string, interpolations?: {[string]: string | number}) =>
        i18n.translate(key, interpolations)
    : (key: string) => key;
};

/*
The `withTranslations` HOC takes an array of translation keys as an argument,
but does not use it at runtime.
However, these keys are captured by `babel-plugin-i18n` at compile-time by
Fusion's compiler and the compiler uses generate a map of all translations
in the app.
The translation map is then exposed by `fusion-plugin-i18n/chunk-translation-map.js`
*/

export const withTranslations = (
  translationKeys: string[] /*translationKeys*/
) => {
  return <PassedProps: *>(
    Component: React$ComponentType<PassedProps>
  ): Class<React$Component<$Diff<PassedProps, InjectedPropsType>>> => {
    class WithTranslations extends React.Component<PassedProps> {
      translate: TranslateType = createTranslate(this.context);

      render() {
        return <Component {...this.props} translate={this.translate} />;
      }
    }

    const displayName = Component.displayName || Component.name;
    WithTranslations.displayName = `withTranslations(${displayName})`;
    WithTranslations.contextTypes = {
      i18n: PropTypes.object.isRequired,
    };

    return WithTranslations;
  };
};
