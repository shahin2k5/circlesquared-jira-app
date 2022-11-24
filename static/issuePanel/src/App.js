import React, { useEffect, useState } from 'react';
import AddIcon from '@atlaskit/icon/glyph/add';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import Button from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import { invoke, router, Modal } from '@forge/bridge';
import Progressbar from './components/Progressbar';
import Spinner from '@atlaskit/spinner';

function App() {
  const [rendering, setRendering] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAppActive, setIsAppActive] = useState(false);
  const [issueRuns, setIssueRuns] = useState([]);
  const modal = new Modal({
    resource: 'issuePanelModal',
    closeOnOverlayClick: false,
    closeOnEscape: false,
    onClose: (payload) => {
      console.log('onClose called with', payload);
    },
    size: 'large'
  });

  useEffect(() => {
    invoke('getAppSettings').then((response) => {
      setRendering(false);
      if(response.active) {
        setIsAppActive(response.active);
        invoke("getIssueRuns").then((response) => {
          setLoading(false);
          setIssueRuns(Array.isArray(response) ? response : []);
        });
      }
    });
  }, []);

  const openModal = () => {
    modal.open();
  }

  if(rendering) {
    return <Spinner/>;
  }

  if(!isAppActive) {
    return (
      <div>Please contact your administration for activation of the plugin.</div>
    )
  }

  return (
    <div>
      <Button
        style={{marginBottom: "5px"}}
        iconBefore={<AddIcon size="small" />}
        appearance="primary"
        spacing="compact"
        onClick={openModal}
      >
        Link a run
      </Button>
      <DynamicTable
          head={{
              cells: [
                { content: 'Name' },
                { content: 'Date' },
                { content: 'Status' },
              ]
          }}
          rows={issueRuns.map(run => ({
              key: run.id,
              cells: [
                  { content: (<a href="https://google.com" onClick={() => router.open('https://google.com')} target="_blank">{run.name}</a>) },
                  { content: run.date },
                  { content: (
                      <div style={{ display: "flex", alignItems: "center" }}>
                          <Progressbar status={run.status}/>
                          <Button spacing="compact" appearance="subtle-link" onClick={() => alert(run.id)}><TrashIcon size="small"/></Button>
                      </div>
                      )
                  },
              ]
          }))}
          rowsPerPage={5}
          defaultPage={1}
          loadingSpinnerSize="small"
          isLoading={loading}
      />
    </div>
  );
}

export default App;
