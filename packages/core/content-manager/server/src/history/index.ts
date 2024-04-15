import type { Plugin } from '@strapi/types';
import { controllers } from './controllers';
import { services } from './services';
import { routes } from './routes';
import { getService } from './utils';
import { historyVersion } from './models/history-version';

/**
 * Check once if the feature is enabled (both license info & feature flag) before loading it,
 * so that we can assume it is enabled in the other files.
 */
const getFeature = (): Partial<Plugin.LoadedPlugin> => {
  if (
    strapi.features.future.isEnabled('history') &&
    strapi.ee.features.isEnabled('cms-content-history')
  ) {
    return {
      register({ strapi }) {
        strapi.get('models').add(historyVersion);
      },
      bootstrap({ strapi }) {
        // Start recording history and saving history versions
        getService(strapi, 'history').bootstrap();
      },
      destroy({ strapi }) {
        getService(strapi, 'history').destroy();
      },
      controllers,
      services,
      routes,
    };
  }

  /**
   * Keep registering the model to avoid losing the data if the feature is disabled,
   * or if the license expires.
   */
  return {
    register({ strapi }) {
      strapi.get('models').add(historyVersion);
    },
  };
};

export default getFeature();
