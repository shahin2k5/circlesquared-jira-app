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
  const [appSettings, setAppSettings] = useState({});
  const [issueRuns, setIssueRuns] = useState([]);
  const [searchRuns, setSearchRuns] = useState([]);
  const [txtConsole, settxtConsole] = useState([]);
 

  useEffect(async () => {
    await invoke('getAppSettings').then(async (settings) => {
      setRendering(false);
      setAppSettings(settings);
       if(settings.status) {
        await invoke("getIssueRuns").then((response) => {
          //settxtConsole(JSON.stringify(response))
          setLoading(false); 
          setIssueRuns(Array.isArray(response) ? response : []);
        }).catch(error=>{
          if(error){
            alert('issuePanel 28::'+JSON.stringify(error));
          }
        }); 
      }
    });
  }, []);

  const openModal = () => {
    const modal = new Modal({
      resource: 'issuePanelModal',
      closeOnOverlayClick: false,
      closeOnEscape: false,
      onClose: async (payload) => {
        setLoading(true);
         await invoke("getIssueRuns").then((response) => {
          setLoading(false); 
          setIssueRuns(Array.isArray(response) ? response : []);
        }).catch(error=>{
          if(error){
            alert(JSON.stringify(error));
          }
        }); 
        setLoading(false);

      },
      size: 'large',
      context: {
        customKey: searchRuns,
      },
    });
    modal.open();
  }

  if(rendering) {
    return <Spinner/>;
  }

  if(!appSettings.status) {
    return (
      <div>Please contact your organization admin for activation of the plugin.</div>
    )
  }


  const makeUnlinkRunTicket = async (  runId )=>{
		setLoading(true);
		await invoke("unlinkRunTicket",runId).then(async ( response) => {
      const data = await response;	
      setIssueRuns(data) 	  
		}).catch(error=>{
      if(error){
        alert('Error 42: '+JSON.stringify(error));
      }
		});
   
		setLoading(false);
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
      <p>{txtConsole}</p>
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
                  { content: (<a href="https://circlesquared.co/user/testrun/details/{run.testrun?run.testrun.id:''}" onClick={() => router.open('https://circlesquared.co/user/testrun/details/'+run.testrun?run.testrun.id:'')} target="_blank">{run.testrun?run.testrun.test_run_title:''}</a>) },
                  { content: new Date(run.created_at).toLocaleDateString() },
                  { content: (
                      <div style={{ display: "flex", alignItems: "center" }}>
                          <Progressbar status={run.status}/>
                          <Button spacing="compact" appearance="subtle-link" onClick={() => makeUnlinkRunTicket(run.testrun?run.testrun.id:'')}><TrashIcon size="small"/></Button>
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
