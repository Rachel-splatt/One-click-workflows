document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded in workflows.ts');
    const editButtons = document.querySelectorAll('.button-group .button[aria-label="Edit workflow"]');
    console.log('Edit buttons found:', editButtons.length);
    editButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            console.log(`Button ${index + 1} clicked`);
            const workflowType = (button as HTMLElement).dataset.workflowType;
            console.log('Workflow type:', workflowType);
            
            // Find the workflow name
            let workflowName = '';
            const workflowSection = button.closest('.one-click-workflows');
            if (workflowSection) {
                const nameElement = workflowSection.querySelector('h4');
                workflowName = nameElement ? nameElement.textContent?.trim() || '' : '';
                console.log('Workflow section found, name element:', !!nameElement);
            } else {
                console.log('Workflow section not found');
            }
            console.log('Workflow name:', workflowName);

            if (workflowType) {
                // Store the data in sessionStorage
                sessionStorage.setItem('workflowType', workflowType);
                sessionStorage.setItem('workflowName', workflowName);
                console.log('Data stored in sessionStorage');
                window.location.href = 'new-workflow.html';
            } else {
                console.log('No workflow type found, navigating to new-workflow.html');
                window.location.href = 'new-workflow.html';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded in new-workflow.ts');
    const workflowType = sessionStorage.getItem('workflowType');
    const workflowName = sessionStorage.getItem('workflowName');
    console.log('SessionStorage data:', { workflowType, workflowName });

    const triggerButtons = document.querySelectorAll('button.vertical[role="radio"]');
    console.log('Trigger buttons found:', triggerButtons.length);
    const pageTitle = document.getElementById('workflow-name');
    const workflowNameInput = document.getElementById('name') as HTMLInputElement | null;
    console.log('Page title found:', !!pageTitle);
    console.log('Workflow name input found:', !!workflowNameInput);

    // Function to set aria-checked and update visual state
    function setCheckedButton(button: HTMLElement) {
        triggerButtons.forEach((btn) => {
            btn.setAttribute('aria-checked', 'false');
            btn.classList.remove('selected');
        });
        button.setAttribute('aria-checked', 'true');
        button.classList.add('selected');
        console.log('Button checked:', button.textContent?.trim());
    }

    // Set initial state based on sessionStorage data
    if (workflowType) {
        const triggerButton = document.querySelector(`button[data-workflow-type="${workflowType}"]`) as HTMLElement | null;
        console.log('Trigger button found:', !!triggerButton);
        if (triggerButton) {
            setCheckedButton(triggerButton);
        }
    }

    // Update page title and workflow name input
    if (workflowName) {
        console.log('Attempting to set workflow name:', workflowName);
        if (pageTitle) {
            pageTitle.textContent = workflowName;
            console.log('Page title updated to:', pageTitle.textContent);
        } else {
            console.log('Page title element not found');
        }
        if (workflowNameInput) {
            workflowNameInput.value = workflowName;
            console.log('Workflow name input updated to:', workflowNameInput.value);
        } else {
            console.log('Workflow name input not found');
        }
    } else {
        console.log('No workflow name provided in sessionStorage');
    }

    // Add click event listeners to all trigger buttons
    triggerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setCheckedButton(button as HTMLElement);
        });
    });

    // Clear the sessionStorage after using the data
    sessionStorage.removeItem('workflowType');
    sessionStorage.removeItem('workflowName');
});