import $RefParser from '@stoplight/json-schema-ref-parser';
import { NodeType } from '@stoplight/types';
import { isObject } from 'lodash';
import * as React from 'react';

import { useParsedData } from '../components/Docs';

/**
 * Parses the branch node data and ONLY dereferences if it's an HTTP Operation
 * @param type branch node snapshot type
 * @param data branch node snapshot data
 */
export function useDereferencedData(type: NodeType, data: string) {
  const parsedData = useParsedData(type, data);

  const [dereferencedData, setDereferencedData] = React.useState(parsedData);

  React.useEffect(() => {
    // Only dereference HTTP Operations
    if (!isObject(parsedData) || type !== NodeType.HttpOperation) {
      setDereferencedData(parsedData);
      return;
    }

    $RefParser
      .dereference(parsedData, { continueOnError: true })
      .then(res => setDereferencedData(res))
      .catch(reason => {
        console.error(`Could not dereference operation: ${reason.message}`);
        console.error(reason);
        setDereferencedData(parsedData);
      });
  }, [parsedData, type]);

  return dereferencedData;
}