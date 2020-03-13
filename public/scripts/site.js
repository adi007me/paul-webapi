window.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll(".result-dropdown").forEach(dropdown => {
        const result = dropdown.getAttribute('data-result');

        if (result) {
            let resultIndex = 0;

            for(let i = 0; i < dropdown.options.length; i++) {
                let o = dropdown.options[i];
                
                if (o.value === result) {
                    resultIndex = i;
                }
            }

            dropdown.selectedIndex = resultIndex;
        }
    });

    document.querySelectorAll("tbody>tr").forEach(row => {
       let matchDateStr = row.getAttribute('data-match-date');
       
       let matchDate = new Date(matchDateStr);

       if (matchDate < new Date()) {
           row.classList.add("past-match");
       }
    });

    document.querySelectorAll('.updateResult').forEach(button => {
        button.addEventListener('click', async event => {
            const matchId = event.target.getAttribute('data-match');
            const select = document.querySelector('#result-' + matchId);
            
            const result =  select.selectedOptions[0].value;

            const confirmation = confirm(`Match ${matchId}, Result ${result}. Sure ?`);

            if (confirmation) {
                const body = JSON.stringify({
                    matchIdResult: matchId,
                    result: result
                });

                await fetch('/admin/result', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body
                });
            }
        });
    });
});