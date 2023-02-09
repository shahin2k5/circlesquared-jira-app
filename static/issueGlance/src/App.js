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
  const [issueTests, setIssueTests] = useState([]);
  const [searchRuns, setSearchRuns] = useState([]);
 

  useEffect(async () => {
    await invoke('getAppSettings').then(async (settings) => {
      setRendering(false);
      setAppSettings(settings);
       if(settings.status) {
        await invoke("getIssueTestcases").then((response) => {
          setLoading(false); 
          setIssueTests(Array.isArray(response) ? response : []);
        }).catch(error=>{
          if(error){
            alert('error::::'+JSON.stringify(error));
          }
        }); 
      }
    });
  }, []);

  const openModal = () => {
    const modal = new Modal({
      resource: 'issueGlanceModal',
      closeOnOverlayClick: false,
      closeOnEscape: false,
      onClose: async (payload) => {
        setLoading(true);
         await invoke("getIssueTestcases").then((response) => {
          setLoading(false); 
          console.log(JSON.stringify(response))
          setIssueTests(Array.isArray(response) ? response : []);
        }).catch(error=>{
          if(error){
            if(error){
              alert(JSON.stringify(error));
            }
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


  const makeUnlinkTestcaseTicket = async (  testId )=>{
		setLoading(true);
		await invoke("unlinkTestcaseTicket",testId).then(async ( response) => {
      const data = await response;	
      setIssueTests(data) 	  
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
        Link a test cases
      </Button>
      <DynamicTable
          head={{
              cells: [
                { content: 'Name' },
                { content: 'Date' },
                { content: 'Status' },
              ]
          }}
          rows={issueTests.map(test => ({
              key: test.id,
              cells: [
                  { content: (<a href="https://circlesquared.co/user/project-details/{test.testcases.project_id}" onClick={() => router.open('https://circlesquared.co/user/project-details/'+test.testcases.project_id)} target="_blank">{test.testcases.testcase_name}</a>) },
                  { content: new Date(test.testcases.created_at).toLocaleDateString() },
                  { content: (
                      <div style={{ display: "flex", alignItems: "center" }}>
                          <Progressbar status={test.status}/>
                          <Button spacing="compact" appearance="subtle-link" onClick={() => makeUnlinkTestcaseTicket(test.testcases.id)}><TrashIcon size="small"/></Button>
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
