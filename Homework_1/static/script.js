const submitApplication = () =>{
    const name = document.getElementById('name').value.trim();
    const zipcode = document.getElementById('zipcode').value.trim();

    if(!name || !zipcode){
        alert('You need to provide name and zipcode for your application!!');
        return;
    }

    fetch('/api/apply',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, zipcode})
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.application_number){
            document.getElementById('applicationResponse').innerText =
            `Your application is submitted successfully. Your application number is ${data.application_number}.`
        }else{
            document.getElementById('applicationResponse').innerText = 'Error: Could not submit application.';

        }
    })

}

const checkStatus = () =>{
    const appId = document.getElementById('statusAppId').value;

    if(!appId){
        alert('You need to provide your application id to check the status of your application!!');
        return;
    }

    fetch(`/api/status/${appId}`)
    .then(response=> response.json())
    .then(data=>{
        const statusEle = document.getElementById('statusResponse');

        if(data.status){
            statusEle.innerText = `Application Status: ${data.status}`;

            switch(data.status){
                case 'not found':
                    statusEle.style.color = 'gray';
                    break;
                case 'received':
                    statusEle.style.color = 'blue';
                    break;
                case 'processing':
                    statusEle.style.color = 'orange';
                    break;
                case 'accepted':
                    statusEle.style.color = 'green';
                    break;
                case 'rejected':
                    statusEle.style.color = 'red';
                    break;
                default:
                    statusEle.style.color = 'black';
            }
        }else{
            statusEle.innerText = 'Application not found.';
            statusEle.style.color = 'gray';
        }
        
    })
}

const updateStatus = () =>{
    const appId = document.getElementById('updateAppId').value;
    const newStatus = document.getElementById('newStatus').value;

    if(!appId){
        alert('Please provide application id to update the status!!');
        return;
    }

    fetch(`/api/status/${appId}`,{
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({status: newStatus})
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.message){
            document.getElementById('updateResponse').innerText = 'Status updated successfully.';
        }else{
            document.getElementById('updateResponse').innerText = 'Error: Could not update status.';
        }
    })
}