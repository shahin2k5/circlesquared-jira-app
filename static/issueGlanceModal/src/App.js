import React, { Fragment, useState } from 'react';
import { view, invoke } from '@forge/bridge';
import Textfield from '@atlaskit/textfield';
import CrossIcon from '@atlaskit/icon/glyph/cross'
import Form, { Field } from '@atlaskit/form';
import Button from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import Progressbar from './components/Progressbar';
import DynamicTable from '@atlaskit/dynamic-table';
 

function App() {
	const [loading, setLoading] = useState(false);
	const [runs, setRuns] = useState([])
	const [linkedRuns, setLinkedRuns] = useState([])
	 

	const  handleSubmit =   async (data) => {
		
		setLoading(true);
		await invoke("getRunSearch",data).then((response) => {
			setRuns(response); 
		}).catch(error=>{
			alert('Error 27: '+JSON.stringify(error));
		});
		setLoading(false);	 
	}

	const makeLinkRunTicket = async (  runId, linkUnlink )=>{
		setLoading(true);
		let func_url = "makeLinedkRunTicket"
		if(linkUnlink=="unlink"){
			func_url = "unlinkRunTicket";
		} 
		await invoke(func_url,runId).then(async ( response) => {
			const data = await response;	
			let runList = runs.map(run=>{
					if(run.id==runId){
						if(linkUnlink=="unlink"){
							return {...run, linked:[]}
						}else{
							return {...run, linked:[data]}
						}
					}else{
						return run;
					}
				})
				setRuns(runList) 
		 
		}).catch(error=>{
			//alert('Error 42: '+JSON.stringify(error));
		});
 
		setLoading(false);
	}

 
	return (
		<div>
			<div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between", backgroundColor: "#f9f9f9" }}>
				<h2>Search Test Runs</h2>
				<Button appearance="subtle-link" spacing="none" onClick={() => view.close()}><CrossIcon/></Button>
			</div>
			<div style={{ padding: "15px 20px" }}>
				<Form onSubmit={handleSubmit}>
					{({ formProps }) => (
						<form {...formProps} style={{ display: "flex", gap: "10px", alignItems: "flex-end", marginBottom: "15px" }}>
							<div style={{ flex: 1 }}>
								<Field
									aria-required={true}
									name="q"
									defaultValue=""
									isDisabled={loading}
									isRequired
								>
									{({ fieldProps }) => (
										<Textfield {...fieldProps} type="search" placeholder="Search runs by name"/>
									)}
								</Field>
							</div>
							<LoadingButton type="submit" appearance="primary" style={{ height: "auto", paddingTop: "3.5px", paddingBottom: "3.5px" }} isLoading={loading}>Search Run</LoadingButton>
						</form>
					)}
				</Form>
				
				<DynamicTable
					head={{
						cells: [
							{ content: 'Title' },
							{ content: 'Project' },
							{ content: 'Author' },
							{ content: 'Status' },
						]
					}}
					rows={runs.map(run => ({
						key: run.id,
						cells: [
							{ content: run.test_run_title },
							{ content: run.project_id },
							{ content: run.test_run_description },
							{ content: (
								<div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
									<Progressbar status={run.id}/>
									<Button spacing="compact" appearance="primary" onClick={()=>makeLinkRunTicket(run.id, run.linked.length?'unlink':'link')} style={{width:"80px"}} title={run.linked.length?'Click to unlinked':'Click to link '}>
										{run.linked.length?'Linked':' Link '}
									</Button>
								</div>
								)
							},
						]
					}))}
					rowsPerPage={14}
					defaultPage={1}
					loadingSpinnerSize="small"
					isLoading={loading}
					emptyView="No result"
				/>

			 
			</div>
		</div>
	);
}

export default App;