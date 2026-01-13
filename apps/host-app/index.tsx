/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import { name as appName } from './app.json';
import { Federated, ScriptManager } from '@callstack/repack/client';
import App from './src';

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  const containers = {
    // Ponto de entrada
    rootzz: 'http://localhost:9000/container.bundle',
  };

  // Se o scriptId for o nome do container, retorna a URL direta
  if (containers[scriptId]) {
    return {
      url: containers[scriptId],
      query: { platform: Platform.OS },
      cache: false,
    };
  }

  // SEGREDO: Se o caller (quem chamou) for 'rootzz', 
  // buscamos o chunk (pedaço) no servidor do rootzz
  if (caller === 'rootzz') {
    return {
      url: `http://localhost:9000/${scriptId}.bundle`,
      query: { platform: Platform.OS },
      cache: false,
    };
  }
});

AppRegistry.registerComponent(appName, () => App);
