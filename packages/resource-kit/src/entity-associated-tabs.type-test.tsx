import { Plus } from 'lucide-react';

import {
  EntityAssociatedTabPanel,
  buildEntityAssociationOptions,
  mapAssociationValuesToPayload,
} from './index';

const associationOptions = buildEntityAssociationOptions([], {
  entityType: 'contact',
  entityId: 'contact_123',
  label: 'Ada Lovelace',
});

const payload = mapAssociationValuesToPayload(['contact:contact_123'], associationOptions);
payload satisfies readonly {
  readonly entityId: string;
  readonly entityType: 'contact' | 'property' | 'request' | 'opportunity' | 'activity' | 'note' | 'document';
}[];

function ExampleAssociatedPanel(): React.ReactElement {
  return (
    <EntityAssociatedTabPanel
      icon={Plus}
      name="Notes"
      addLabel="Add note"
      onAdd={() => undefined}
    >
      <div>Reusable associated content</div>
    </EntityAssociatedTabPanel>
  );
}

ExampleAssociatedPanel satisfies () => React.ReactElement;
