document.addEventListener('DOMContentLoaded', () => {
    const publishButtons = document.querySelectorAll('.one-click-workflows .button.primary');
    
    publishButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const workflow = button.closest('.one-click-workflows') as HTMLElement;
            if (workflow) {
                createPublishedWorkflow(workflow);
            }
        });
    });

    // Initial check
    checkAndUpdateOneClickWorkflowsVisibility();
});

function createPublishedWorkflow(workflow: HTMLElement): void {
    console.log('createPublishedWorkflow called');
    const title = workflow.querySelector('h4')?.textContent || 'Untitled Workflow';
    const description = workflow.querySelector('.workflow-description')?.textContent || '';

    console.log('Workflow title:', title);
    console.log('Workflow description:', description);

    const subjectLines: { [key: string]: string } = {
        "Wished-for item": "Come back for 15% off an item on your wishlist!",
        "Thank you": "Our Way of Saying Thanks – 10% Off Just for You",
        "Abandoned cart discount": "Your cart misses you - 15% off inside!"
    };

    console.log('Available subject lines:', Object.keys(subjectLines));

    const subjectLine = subjectLines[title] || description;
    console.log(`Subject line for "${title}": ${subjectLine}`);

    // Update status to "Published"
    const statusElement = workflow.querySelector('.workflow-status');
    if (statusElement) {
        statusElement.innerHTML = '<span class="icon icon-circle-fill" style="color: green;"></span> Published';
    }

    // Disable the publish button
    const publishButton = workflow.querySelector('.button.primary');
    if (publishButton) {
        publishButton.setAttribute('disabled', 'true');
        publishButton.textContent = 'Published';
    }

    const delayBeforeFade = 750; // 2 seconds

    setTimeout(() => {
        workflow.style.transition = 'opacity 0.5s';
        workflow.style.opacity = '0';

        setTimeout(() => {
            animateGridLayout(workflow);
            
            setTimeout(() => {
                workflow.style.display = 'none';
                addToPublishedWorkflows(title, description);
                checkAndUpdateOneClickWorkflowsVisibility();
            }, 500);
        }, 250);
    }, delayBeforeFade);
}

function addToPublishedWorkflows(title: string, description: string): void {
    const workflowList = document.getElementById('workflow-list');
    if (!workflowList) return;

    const existingWorkflow = Array.from(workflowList.children).find(
        child => child.querySelector('h3')?.textContent === title
    );

    if (existingWorkflow) {
        console.log(`Workflow "${title}" already exists in published list`);
        return;
    }

    const subjectLines: { [key: string]: string } = {
        "Wished-for item": "Come back for 15% off an item on your wishlist!",
        "Thank you": "Our Way of Saying Thanks – 10% Off Just for You",
        "Abandoned cart discount": "Your cart misses you - 15% off inside!"
    };

    const subjectLine = subjectLines[title] || description;
    console.log(`Adding workflow: ${title} with subject: ${subjectLine}`);

    const newWorkflowWrapper = document.createElement('div');
    newWorkflowWrapper.innerHTML = `
        <table>
            <caption>
                <div style="display: flex; align-items: center;">
                    <h3 style="margin-right: auto;">${title}</h3>
                    <div style="display: flex; gap: var(--spacer-4); align-items: center;">
                        <small><span class="icon icon-circle-fill"></span> Published</small>
                        <div class="button-group">
                            <a class="button" aria-label="Edit workflow" href="#"><span class="icon icon-pencil"></span></a>
                            <button class="button outline-danger" type="button" aria-label="Delete workflow"><span class="icon icon-trash2"></span></button>
                        </div>
                    </div>
                </div>
            </caption>
            <thead>
                <tr>
                    <th style="width: 40%;">Email</th>
                    <th>Delay</th>
                    <th>Sent</th>
                    <th>Opens</th>
                    <th>Clicks</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td data-label="Email">${subjectLine}</td>
                    <td data-label="Delay">24 Hours</td>
                    <td data-label="Sent" style="white-space: nowrap;">0</td>
                    <td data-label="Opens" style="white-space: nowrap;">0%</td>
                    <td data-label="Clicks" style="white-space: nowrap;">0</td>
                </tr>
            </tbody>
        </table>
    `;

    newWorkflowWrapper.style.opacity = '0';
    newWorkflowWrapper.style.transform = 'translateY(20px)';
    workflowList.insertBefore(newWorkflowWrapper, workflowList.firstChild);

    // Trigger reflow
    newWorkflowWrapper.offsetHeight;

    newWorkflowWrapper.style.transition = 'opacity 0.5s, transform 0.5s';
    newWorkflowWrapper.style.opacity = '1';
    newWorkflowWrapper.style.transform = 'translateY(0)';

    // Add event listener to the delete button
    const deleteButton = newWorkflowWrapper.querySelector('.button.outline-danger');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => deletePublishedWorkflow(newWorkflowWrapper, null));
    }
}

function deletePublishedWorkflow(publishedWorkflow: HTMLElement, originalWorkflow: HTMLElement | null): void {
    // Remove the published workflow
    publishedWorkflow.remove();

    // Find the original workflow if it wasn't passed
    if (!originalWorkflow) {
        const title = publishedWorkflow.querySelector('h3')?.textContent;
        const workflows = document.querySelectorAll('.one-click-workflows');
        originalWorkflow = Array.from(workflows).find(workflow => 
            workflow.querySelector('h4')?.textContent === title
        ) as HTMLElement | null;
    }

    if (originalWorkflow) {
        // Reset the original workflow section
        const statusIndicator = originalWorkflow.querySelector('p span.icon');
        if (statusIndicator instanceof HTMLElement) {
            statusIndicator.style.color = '';
        }
        const statusText = originalWorkflow.querySelector('.workflow-status');
        if (statusText) {
            statusText.innerHTML = '<span class="icon icon-circle" style="color: var(--color-gray-400);"></span> Unpublished';
        }
        const publishButton = originalWorkflow.querySelector('.button.primary');
        if (publishButton) {
            publishButton.textContent = 'Publish';
            publishButton.removeAttribute('disabled');
        }

        // Show the original workflow with animation
        originalWorkflow.style.display = '';
        originalWorkflow.style.opacity = '0';
        originalWorkflow.style.transform = 'translateY(20px)';

        // Trigger reflow
        originalWorkflow.offsetHeight;

        // Animate the workflow reappearing
        originalWorkflow.style.transition = 'opacity 0.5s, transform 0.5s';
        originalWorkflow.style.opacity = '1';
        originalWorkflow.style.transform = 'translateY(0)';
    }

    // Check if any workflows are still published and show the container if necessary
    checkAndUpdateOneClickWorkflowsVisibility();
}

function checkAndUpdateOneClickWorkflowsVisibility(): void {
    const statsGrid = document.querySelector('.stats-grid');
    if (!(statsGrid instanceof HTMLElement)) return;

    const oneClickWorkflows = statsGrid.querySelectorAll('.one-click-workflows');
    const anyVisible = Array.from(oneClickWorkflows).some(workflow => 
        workflow instanceof HTMLElement && workflow.style.display !== 'none'
    );

    const parentDiv = statsGrid.parentElement;
    if (parentDiv instanceof HTMLElement) {
        parentDiv.style.display = anyVisible ? '' : 'none';
    }
    

}

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
    const oneClickWorkflows = document.querySelectorAll('.one-click-workflows');
    const publishedWorkflowsContainer = document.getElementById('published-workflows');

    oneClickWorkflows.forEach(workflow => {
        const publishButton = workflow.querySelector('.publish-button');
        const statusText = workflow.querySelector('.status-text');
        const workflowType = workflow.getAttribute('data-workflow-type');

        publishButton?.addEventListener('click', () => publishWorkflow(workflow as HTMLElement, workflowType));
    });

    function publishWorkflow(workflow: HTMLElement, workflowType: string | null) {
        // Update status to "Published"
        const statusText = workflow.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = 'Published';
            statusText.parentElement?.classList.add('published');
        }

        // Disable the publish button
        const publishButton = workflow.querySelector('.publish-button');
        if (publishButton) {
            publishButton.setAttribute('disabled', 'true');
            publishButton.textContent = 'Published';
        }

        // Animate the card sliding away
        setTimeout(() => {
            workflow.style.transition = 'transform 0.5s, opacity 0.5s';
            workflow.style.transform = 'translateX(100%)';
            workflow.style.opacity = '0';

            // Remove the workflow from the one-click section
            setTimeout(() => {
                workflow.remove();
                addToPublishedWorkflows(workflowType);
            }, 500);
        }, 1000);
    }

    function addToPublishedWorkflows(workflowType: string | null) {
        if (!publishedWorkflowsContainer || !workflowType) return;

        const newWorkflow = document.createElement('div');
        newWorkflow.className = 'published-workflow';
        newWorkflow.innerHTML = `
            <h3>${getWorkflowTitle(workflowType)}</h3>
            <p><span class="icon icon-circle-fill"></span> Published</p>
        `;

        newWorkflow.style.opacity = '0';
        newWorkflow.style.transform = 'translateY(20px)';
        publishedWorkflowsContainer.appendChild(newWorkflow);

        // Trigger reflow
        newWorkflow.offsetHeight;

        newWorkflow.style.transition = 'opacity 0.5s, transform 0.5s';
        newWorkflow.style.opacity = '1';
        newWorkflow.style.transform = 'translateY(0)';
    }

    function getWorkflowTitle(workflowType: string): string {
        switch (workflowType) {
            case 'wished-item':
                return 'Wished-for item';
            case 'thank-you':
                return 'Thank you';
            case 'abandoned-cart':
                return 'Abandoned cart discount';
            default:
                return 'New Workflow';
        }
    }
});
function animateGridLayout(publishedWorkflow: HTMLElement): void {
    console.log('animateGridLayout called');
    const statsGrid = document.querySelector('.stats-grid') as HTMLElement;
    if (!statsGrid) {
        console.error('Stats grid not found');
        return;
    }

    const items = Array.from(statsGrid.querySelectorAll('.one-click-workflows')) as HTMLElement[];
    const publishedIndex = items.indexOf(publishedWorkflow);
    console.log(`Published workflow index: ${publishedIndex}`);

    // Get the computed style of the grid
    const gridComputedStyle = window.getComputedStyle(statsGrid);
    const columns = gridComputedStyle.gridTemplateColumns.split(' ').length;

    // Determine if we're in a mobile layout (single column)
    const isMobileLayout = columns === 1;

    // Calculate the dimensions of a single card (including gap)
    const cardWidth = items[0].offsetWidth + parseInt(gridComputedStyle.columnGap);
    const cardHeight = items[0].offsetHeight + parseInt(gridComputedStyle.rowGap);

    items.forEach((item, index) => {
        if (index > publishedIndex) {
            console.log(`Animating item ${index}`);
            item.style.transition = 'transform 0.5s ease-out';
            if (isMobileLayout) {
                // Slide up for mobile layout
                item.style.transform = `translateY(-${cardHeight}px)`;
            } else {
                // Slide left for desktop layout, but only in the same row
                const publishedRow = Math.floor(publishedIndex / columns);
                const currentRow = Math.floor(index / columns);
                if (currentRow === publishedRow) {
                    item.style.transform = `translateX(-${cardWidth}px)`;
                }
            }
        }
    });

    // Remove transitions after animation completes
    setTimeout(() => {
        items.forEach(item => {
            item.style.transition = 'none';
            item.style.transform = '';
        });
        // Force reflow
        statsGrid.offsetHeight;
        // Re-enable transitions
        items.forEach(item => {
            item.style.transition = '';
        });
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded in workflows.ts');
    const publishButtons = document.querySelectorAll('.one-click-workflows .button.primary');
    console.log(`Found ${publishButtons.length} publish buttons`);
    
    publishButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const workflow = button.closest('.one-click-workflows') as HTMLElement;
            if (workflow) {
                createPublishedWorkflow(workflow);
            }
        });
    });
});