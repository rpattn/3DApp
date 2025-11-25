import React, { useMemo } from 'react';
import { EffectComposer, Outline, Selection } from '@react-three/postprocessing';
import { ModelComponent, ModelConfig } from './ModelComponent';

interface ModelManagerProps {
  models: ModelConfig[];
  highlightIndex?: number;
  assetBasePath: string;
}

export function ModelManager({ models, highlightIndex, assetBasePath }: ModelManagerProps) {
  const preparedModels = useMemo(() => {
    return models
      .filter((model) => model.show !== false)
      .map((model, index) => ({ ...model, highlight: highlightIndex === index }));
  }, [highlightIndex, models]);

  return (
    <Selection>
      <EffectComposer multisampling={8} autoClear={false}>
        <Outline blur visibleEdgeColor={0xff0000} edgeStrength={3} width={1} />
      </EffectComposer>
      {preparedModels.map((model) => (
        <ModelComponent key={model.name} config={model} assetBasePath={assetBasePath} />
      ))}
    </Selection>
  );
}
