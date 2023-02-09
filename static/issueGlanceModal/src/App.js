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
	const [testcases, setTestcases] = useState([])
	const [linkedRuns, setLinkedRuns] = useState([])
	 

	const  handleSubmit =   async (data) => {
		
		setLoading(true);
		await invoke("getTestcaseSearch",data).then((response) => {
			console.log(response)
			setTestcases(response); 
		}).catch(error=>{
			if(error){
				alert('Error 27: '+JSON.stringify(error));
			}
		});
		setLoading(false);	 
	}

	const makeLinkTestcaseTicket = async (  testId, linkUnlink )=>{
		setLoading(true);
		let func_url = "makeLinedkTestcaseTicket"
		if(linkUnlink=="unlink"){
			func_url = "unlinkTestcaseTicket";
		} 
		await invoke(func_url,testId).then(async ( response) => {
			const data = await response;	
			
			let testcaseList = testcases.map(test=>{
					if(test.id==testId){
						if(linkUnlink=="unlink"){
							return {...test, linked:[]}
						}else{
							return {...test, linked:[data]}
						}
					}else{
						return test;
					}
				})
				setTestcases(testcaseList) 
		 
		}).catch(error=>{
			if(error){
				alert('Error 42: '+JSON.stringify(error));
			}
		});
 
		setLoading(false);
	}

 
	return (
		<div>
			<div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between", backgroundColor: "#f9f9f9" }}>
				<h2>Search Test cases</h2>
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
						 
							{ content: 'Status' },
						]
					}}
					rows={testcases.map(testcase => ({
						key: testcase.id,
						cells: [
							{ content: testcase.testcase_name },
							{ content: testcase.project_id },
							 
							{ content: (
								<div style={{ display: "flex", alignItems: "right", gap: "15px",marginLeft:'20px' }}>
									<Progressbar status={testcase.id}/>
									<Button spacing="compact" appearance="primary" onClick={()=>makeLinkTestcaseTicket(testcase.id, testcase.linked.length?'unlink':'link')} style={{width:"80px"}} title={testcase.linked.length?'Click to unlinked':'Click to link '}>
										{testcase.linked.length?'Linked':' Link '}
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