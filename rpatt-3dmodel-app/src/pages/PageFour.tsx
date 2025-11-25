import React from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2, PageLayoutType } from '@grafana/data';
import { LinkButton, useStyles2 } from '@grafana/ui';
import { ROUTES } from '../constants';
import { prefixRoute } from '../utils/utils.routing';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { SceneCanvas } from '../components/three/SceneCanvas';

function PageFour() {
  const s = useStyles2(getStyles);

  const environmentUrl =
    'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/autumn_field_puresky_4k.hdr';

  return (
    <PluginPage layout={PageLayoutType.Canvas}>
      <div className={s.page} data-testid={testIds.pageFour.container}>
        <div className={s.container}>
          <LinkButton data-testid={testIds.pageFour.navigateBack} icon="arrow-left" href={prefixRoute(ROUTES.One)}>
            Back
          </LinkButton>
          <div className={s.content}>
            <div className={s.description}>
              <h3>Interactive 3D model viewer</h3>
              <p>
                This page mirrors the ddm-files three.js scene graph: it uses @react-three/fiber for the Canvas,
                @react-three/drei helpers for the camera, sky, and environment, and @react-three/postprocessing for
                model highlighting. Models load through the GLTF loader so you can swap URLs or highlight different
                items without changing the scene wiring.
              </p>
            </div>
            <div className={s.canvasShell}>
              <SceneCanvas environmentUrl={environmentUrl} highlightIndex={0} />
            </div>
          </div>
        </div>
      </div>
    </PluginPage>
  );
}

export default PageFour;

const getStyles = (theme: GrafanaTheme2) => ({
  page: css`
    padding: ${theme.spacing(3)};
    background-color: ${theme.colors.background.secondary};
    display: flex;
    justify-content: center;
  `,
  container: css`
    width: 900px;
    max-width: 100%;
    min-height: 500px;
  `,
  content: css`
    margin-top: ${theme.spacing(6)};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
  `,
  description: css`
    line-height: 1.4;
  `,
  canvasShell: css`
    width: 100%;
    height: 600px;
    border-radius: ${theme.shape.borderRadius(1)};
    border: 1px solid ${theme.colors.border.weak};
    overflow: hidden;
    background: ${theme.colors.background.primary};
  `,
});
