todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));

todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));

todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));

todoForm.addEventListener('submit', onSubmit);

const todoListElement = document.getElementById('todoList');

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api('http://localhost:5000/tasks');

/* Nedan följer callbackfunktionen som är kopplad till alla formulärets fält, när någon skriver i det eller lämnar det.

Funktionen tar emot en parameter - field - som den får genom att e.target skickas till funktionen när den kopplas med addEventListener ovan. */
function validateField(field) {
  /* Destructuring används för att plocka ut endast egenskaperna name och value ur en rad andra egenskaper som field har. 
  Mer om destructuring https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment */

  /* Name är det name-attribut som finns på HTML-taggen. title i detta exempel: <input type="text" id="title" name="title" /> 
  value är innehållet i fältet, dvs. det någon skrivit. */
  const { name, value } = field;

  /* Sätter en variabel som framöver ska hålla ett valideringsmeddelande */
  let = validationMessage = '';
  /* En switchsats används för att kolla name, som kommer att vara title om någon skrivit i eller lämnat titlefältet, annars
   description eller date.   */
  switch (name) {
    /* Så de olika fallen - case - beror på vilket name-attribut som finns på det elementet som skickades till validateField - 
    alltså vilket fält som någon skrev i eller lämnade. */

    /* Fallet om någon skrev i eller lämnade fältet med name "title" */
    case 'title': {
      /* Då görs en enkel validering på om värdet i title-fältet är kortare än 2 */
      if (value.length < 2) {
        /* Om det inte är två tecken långt kommer man in i denna if-sats och titleValid variabeln sätts till false, validationMessage sätts till ett lämpligt 
        meddelande som förklarar vad som är fel.  */
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        /* Validering görs också för att kontrollera att texten i fältet inte har fler än 100 tecken. */
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        /* Om ingen av dessa if-satser körs betyder det att fältet är korrekt ifyllt. */
        titleValid = true;
      }
      break;
    }
    /* Fallet om någon skrev i eller lämnade fältet med name "description" */
    case 'description': {
      /* Liknande enkla validering som hos title */
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    /* Fallet om någon skrev i eller lämnade fältet med name "dueDate" */
    case 'dueDate': {
      /* Här är valideringen att man kollar om något alls har angetts i fältet. dueDate är obligatoriskt därför måste det vara
       mer än 0 tecken i fältet */
      if (value.length === 0) {
        /* I videon för lektion 6 är nedanstående rad fel, det står där descriptionValid =  false;, men ska förstås vara 
        rderdueDateValid = false; */
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }

  /* <p>-elementets innerText (textinnehåll) sätts till den sträng som validationMessage innehåller - information om att titeln är för kort, exempelvis.  */
  field.previousElementSibling.innerText = validationMessage;
  /* Tailwind har en klass som heter "hidden". Om valideringsmeddelandet ska synas vill vi förstås inte att <p>-elementet ska vara hidden, så den klassen tas bort. */
  field.previousElementSibling.classList.remove('hidden');
}

/* Callbackfunktion som används för eventlyssnare när någon klickar på knappen av typen submit */
function onSubmit(e) {
  /* Standardbeteendet hos ett formulär är att göra så att webbsidan laddas om när submit-eventet triggas. I denna applikation 
  vill vi fortsätta att köra JavaScript-kod för att behandla formulärets innehåll och om webbsidan skulle ladda om i detta skede 
  skulle det inte gå.   */

  /* Då kan man använda eventets metod preventDefault för att förhindra eventets standardbeteende, där submit-eventets 
  standardbeteende är att ladda om webbsidan.  */
  e.preventDefault();
  /* Ytterligare en koll görs om alla fält är godkända, ifall man varken skrivit i eller lämnat något fält. */
  if (titleValid && descriptionValid && dueDateValid) {
    /* Log för att se om man kommit förbi valideringen */
    console.log('Submit');

    /* Anrop till funktion som har hand om att skicka uppgift till api:et */
    saveTask();
  }
}

/* Funktion för att ta hand om formulärets data och skicka det till api-klassen. */
function saveTask() {
  /* Ett objekt vid namn task byggs ihop med hjälp av formulärets innehåll */
  /* Eftersom vi kan komma åt fältet via dess namn - todoForm - och alla formulärets fält med dess namn - t.ex. title - kan vi använda detta för att sätta värden 
  hos ett objekt. Alla input-fält har sitt innehåll lagrat i en egenskap vid namn value (som också används i validateField-funktionen, men där har egenskapen 
    value "destrukturerats" till en egen variabel. ) */
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };

  api.create(task).then((task) => {
    /* Task kommer här vara innehållet i promiset. Om vi ska följa objektet hela vägen kommer vi behöva gå hela vägen till servern. Det är nämligen det som skickas
     med res.send i server/api.js, som api-klassens create-metod tar emot med then, översätter till JSON, översätter igen till ett JavaScript-objekt, och till sist
      returnerar som ett promise. Nu har äntligen det promiset fångats upp och dess innehåll - uppgiften från backend - finns tillgängligt och har fått namnet 
      "task".  */
    if (task) {
      /* När en kontroll har gjorts om task ens finns - dvs. att det som kom tillbaka från servern faktiskt var ett objekt kan vi anropa renderList(), som ansvarar 
      för att uppdatera vår todo-lista. renderList kommer alltså att köras först när vi vet att det gått bra att spara ner den nya uppgiften.  */
      renderList();
    }
  });
}

/* En funktion som ansvarar för att skriva ut todo-listan i ett ul-element. */
function renderList() {
  /* Logg som visar att vi hamnat i render-funktionen */
  console.log('rendering');

  /* Anrop till getAll hos vårt api-objekt. Metoden skapades i Api.js och har hand om READ-förfrågningar mot vårt backend. */
  api.getAll().then((tasks) => {
    /* När vi fått svaret från den asynkrona funktionen getAll, körs denna anonyma arrow-funktion som skickats till then() */

    /* Här används todoListElement, en variabel som skapades högt upp i denna fil med koden const todoListElement = document.getElementById('todoList');
     */

    /* Först sätts dess HTML-innehåll till en tom sträng. Det betyder att alla befintliga element och all befintlig text inuti todoListElement tas bort. Det kan
     nämligen finnas list-element däri när denna kod körs, men de tas här bort för att hela listan ska uppdateras i sin helhet. */
    todoListElement.innerHTML = '';

    /* De hämtade uppgifterna från servern via api:et getAll-funktion får heta tasks, eftersom callbackfunktionen som skickades till then() har en parameter som 
    är döpt så. Det är tasks-parametern som är innehållet i promiset. */

    /* Koll om det finns någonting i tasks och om det är en array med längd större än 0 */
    if (tasks && tasks.length > 0) {
      sortDueDate(tasks);
      sortCompletedChore(tasks);
      /* Om tasks är en lista som har längd större än 0 loopas den igenom med forEach. forEach tar, likt then, en callbackfunktion. Callbackfunktionen tar emot 
      namnet på varje enskilt element i arrayen, som i detta fall är ett objekt innehållande en uppgift.  */
        tasks.forEach((task) => {
        /* Om vi bryter ned nedanstående rad får vi något i stil med:
        1. todoListElement: ul där alla uppgifter ska finnas
        2. insertAdjacentHTML: DOM-metod som gör att HTML kan läggas till inuti ett element på en given position
        3. "beforeend": positionen där man vill lägga HTML-koden, i detta fall i slutet av todoListElement, alltså längst ned i listan. 
        4. renderTask(task) - funktion som returnerar HTML. 
        5. task (objekt som representerar en uppgift som finns i arrayen) skickas in till renderTask, för att renderTask ska kunna skapa HTML utifrån egenskaper 
        hos uppgifts-objektet. 
        */

        /* Denna kod körs alltså en gång per element i arrayen tasks, dvs. en  gång för varje uppgiftsobjekt i listan. */
        todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
      });
    }
  });
}

/* renderTask är en funktion som returnerar HTML baserat på egenskaper i ett uppgiftsobjekt. 
Endast en uppgift åt gången kommer att skickas in här, eftersom den anropas inuti en forEach-loop, där uppgifterna loopas igenom i tur och ordning.  */

/* Destructuring används för att endast plocka ut vissa egenskaper hos uppgifts-objektet. Det hade kunnat stå function renderTask(task) {...} här - för det 
är en hel task som skickas in - men då hade man behövt skriva task.id, task.title osv. på alla ställen där man ville använda dem. Ett trick är alltså att 
"bryta ut" dessa egenskaper direkt i funktionsdeklarationen istället. Så en hel task skickas in när funktionen anropas uppe i 
todoListElement.insertAdjacentHTML("beforeend", renderTask(task)), men endast vissa egenskaper ur det task-objektet tas emot här i funktionsdeklarationen. */
function renderTask({ id, title, description, dueDate, completed }) {
  const choreCheckBox = completed == true ? "Checked" : " ";
  const choreComplete = completed == true ? "line-through  " : " ";
  /* Baserat på inskickade egenskaper hos task-objektet skapas HTML-kod med styling med hjälp av tailwind-klasser. Detta görs inuti en templatestring  
  (inom`` för att man ska kunna använda variabler inuti. Dessa skrivs inom ${}) */
  
  let html = `
    <li class="select-none mt-2 py-2 border-b border-pink-400 ${choreComplete}">
      <div class="flex items-center">
      <input type="checkbox" value="${id}" onclick="updateChore(${id})" ${choreCheckBox}>
        <h3 class="mb-3 flex-1 text-xl font-semibold text-pink-600 pl-2">${title}</h3>
        <div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="inline-block bg-yellow-400 hover:bg-amber-500 text-xs border border-white px-3 py-1 rounded-2xl ml-2">Ta bort</button>
        </div>
      </div>`;

  /* Här har templatesträngen avslutats tillfälligt för att jag bara vill skriva ut kommande del av koden om description faktiskt finns */

  description &&
    /* Med hjälp av && kan jag välja att det som står på andra sidan && bara ska utföras om description faktiskt finns.  */

    /* Det som ska göras om description finns är att html-variabeln ska byggas på med HTML-kod som visar det som finns i description-egenskapen hos task-objektet. */
    (html += `
      <p class="ml-8 mt-2 text-xs italic">${description}</p>
  `);

  /* När html-strängen eventuellt har byggts på med HTML-kod för description-egenskapen läggs till sist en sträng motsvarande sluttaggen för <li>-elementet dit. */
  html += `
    </li>`;
  /***********************Labb 2 ***********************/
  /* I ovanstående template-sträng skulle det vara lämpligt att sätta en checkbox, eller ett annat element som någon kan klicka på för att markera en uppgift 
  som färdig. Det elementet bör, likt knappen för delete, också lyssna efter ett event (om du använder en checkbox, kolla på exempelvis w3schools vilket element 
    som triggas hos en checkbox när dess värde förändras.). Skapa en eventlyssnare till det event du finner lämpligt. Funktionen behöver nog ta emot ett id, 
    så den vet vilken uppgift som ska markeras som färdig. Det skulle kunna vara ett checkbox-element som har attributet on[event]="updateTask(id)". */
  /***********************Labb 2 ***********************/

  /* html-variabeln returneras ur funktionen och kommer att vara den som sätts som andra argument i todoListElement.insertAdjacentHTML("beforeend", 
  renderTask(task)) */
  return html;
}

/* Funktion för att ta bort uppgift. Denna funktion är kopplad som eventlyssnare i HTML-koden som genereras i renderTask */
function deleteTask(id) {
  /* Det id som skickas med till deleteTask är taget från respektive uppgift. Eftersom renderTask körs en gång för varje uppgift, och varje gång innehåller en 
  unik egenskap och dess uppgifter, kommer också ett unikt id vara kopplat till respektive uppgift i HTML-listan. Det är det id:t som skickas in hit till 
  'deleteTasks. */

  /* Api-klassen har en metod, remove, som sköter DELETE-anrop mot vårt egna backend */
  api.remove(id).then((result) => {
    /* När REMOVE-förfrågan är skickad till backend via vår Api-klass och ett svar från servern har kommit, kan vi på nytt anropa renderList för att uppdatera 
    listan. Detta är alltså samma förfarande som när man skapat en ny uppgift - när servern är färdig uppdateras listan så att aktuell information visas. */

    renderList();
    /* Notera att parametern result används aldrig i denna funktion. Vi skickar inte tillbaka någon data från servern vid DELETE-förfrågningar, men denna 
    funktion körs när hela anropet är färdigt så det är fortfarande ett bra ställe att rendera om listan, eftersom vi här i callbackfunktionen till then() 
    vet att den asynkrona funktionen remove har körts färdigt. */
  });
}

/***********************Labb 2 ***********************/
/* Här skulle det vara lämpligt att skriva den funktion som angivits som eventlyssnare för när någon markerar en uppgift som färdig. Jag pratar alltså om 
den eventlyssnare som angavs i templatesträngen i renderTask. Det kan t.ex. heta updateTask. 
  
Funktionen bör ta emot ett id som skickas från <li>-elementet.
*/

/* Inuti funktionen kan ett objekt skickas till api-metoden update. Objektet ska som minst innehålla id på den uppgift som ska förändras, samt egenskapen 
completed som true eller false, beroende på om uppgiften markerades som färdig eller ofärdig i gränssnittet. 

Det finns några sätt att utforma det som ska skickas till api.update-metoden. 

Alternativ 1: objektet består av ett helt task-objekt, som också inkluderar förändringen. Exempel: {id: 1,  title: "x", description: "x", dueDate: "x", 
completed: true/false}
Alternativ 2: objektet består bara av förändringarna och id på den uppgift som ska förändras. Exempel: {id: 1, completed: true/false } 

Om du hittar något annat sätt som funkar för dig, använd för all del det, så länge det uppnår samma sak. :)
*/

/* Anropet till api.update ska följas av then(). then() behöver, som bör vara bekant vid det här laget, en callbackfunktion som ska hantera det som kommer 
tillbaka från servern via vår api-klass. Inuti den funktionen bör listan med uppgifter renderas på nytt, så att den nyligen gjorda förändringen syns. */

/* uppdaterar en uppgift */
function updateChore(id) {
  api.update(id).then((result) => {
    renderList();
  });
}

/* sorterar uppgifterna i datum-ordning */
function sortDueDate(tasks) {
  tasks.sort((a, b) => {
    if (a.dueDate < b.dueDate){
      return -1;
    }
    else if (a.dueDate > b.dueDate){
      return 1;
    }
    else {
      return 0;
    }
  });
}

/* sorterar färdiga uppgifter i datum-ordning */
function sortCompletedChore(tasks) {
  tasks.sort((a, b) => {
    if (a.completed < b.completed){
      return -1;
    }
    else if (a.completed > b.completed){
      return 1;
    }
  });
}

/***********************Labb 2 ***********************/

/* Slutligen. renderList anropas också direkt, så att listan visas när man först kommer in på webbsidan.  */
renderList();
