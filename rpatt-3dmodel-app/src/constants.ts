import pluginJson from './plugin.json';

export const PLUGIN_BASE_URL = `/a/${pluginJson.id}`;
export const PLUGIN_ASSET_BASE = `/api/plugins/${pluginJson.id}/resources/assets`;

export enum ROUTES {
  One = 'one',
  Two = 'two',
  Three = 'three',
  Four = 'four',
}
