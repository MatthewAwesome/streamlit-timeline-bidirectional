// STREAMLIT IMPORTS. 
import { Streamlit, RenderData } from "streamlit-component-lib"

// TIMELINE IMPORTS.
import { Timeline } from '@knight-lab/timelinejs';
import '@knight-lab/timelinejs/dist/css/timeline.css';

// NOT SURE WHAT THESE ARE FOR, THEY WERE IN THE TEMPLATE PROVIDE. 
import { time } from "console";
import { Stream } from "stream";

// CONTAINER DIV FOR THE TIMELINE.
const container = document.createElement('div');
container.id = 'timeline-embed';
container.style.width = '100%';
container.style.height = '500px';

// STYLE FOR THE TIMELINE. 
const style = document.createElement('style');
style.innerHTML = `
  body div .tl-headline-date{
    font-size: 32px !important;
    padding-bottom: 5px !important;
  }`;

// APPEND THE STYLE AND CONTAINER TO THE DOCUMENT.
document.head.appendChild(style);
document.body.appendChild(container);

// INITIALIZE THE COMPONENT VALUE TO BE RECEIVED IN PYTHON APP. 
Streamlit.setComponentValue({}); 

/****************************************
 * FUNCTION TO MAKE TIMELINE  
 ***************************************/
function onRender(event: Event): void {

  // GET DATA. 
  const data = (event as CustomEvent<RenderData>).detail;
  
  // UNPACK THE DATA
  let timelineData = data.args["data"]; 
  let height = data.args["height"]; 

  // CONSTRUCT THE TIMELINE 
  if (timelineData) {

    try {

      // ADDITIONAL OPTIONS FOR THE TIMELINE.
      const additionalOptions = {
        is_embed: true,
        height: height ? height : 500,
        marker_height_min: 60,
        slide_padding_lr: 10,
        start_at_slide: timelineData.startIndex ? timelineData.startIndex : 0,
      };

      // TIMELINE OBJECT
      const timeline = new Timeline(container, timelineData.data, additionalOptions);

      // ADD EVENT LISTENER TO SEND DATA TO PYTHON WHEN TIMELINE IS LOADED.
      timeline.on('loaded', (data: any) => {
        console.log('timeline loaded');
        // If we have a title slide and we've just loaded it, we return title: 
        // Create an object to hold the output data:
        let output = {
          text:{headline:"",text:""}, 
          title:false, 
          index: 0
        };

        // Check for a title: 
        if (data && data.title){
          output.title = true;
        }
        else if (data && data.events && data.events.length > 0 && timelineData.startIndex){
          // Get the event from the events array:
          const event = data.events[timelineData.startIndex];
          if (event.text && event.text.headline){
            output.text.headline = event.text.headline;
          }
          if (event.text && event.text.text){
            output.text.text = event.text.text;
          }
        }
        // Send the output to Python:
        Streamlit.setComponentValue(output);
      });


      // CHANGE EVENT LISTENER TO SEND NEW DATA TO PYTHON WHEN SLIDE CHANGES.
      timeline.on('change', (tl_data: any) => {

        if (tl_data && tl_data.unique_id && tl_data.target) {

          // Get index of current slide. Event and slide indices are different in context of title slide. 
          let currentIndex = tl_data.target._getSlideIndex(tl_data.unique_id);
          let eventIndex = tl_data.target.config.title ? currentIndex - 1 : currentIndex;
          
          // Create an object to hold the output data:
          let output = {
            text:{headline:"",text:""}, 
            title:false, 
            index: eventIndex
          };

          if (eventIndex > -1) { // If we have an index greater than -1, we have an event being displayed. 
            // Get the event from the events array:
            const event = tl_data.target.config.events[eventIndex];
            // Fill headline and text. 
            if (event.text && event.text.headline){
              output.text.headline = event.text.headline;
            }
            if (event.text && event.text.text){
              output.text.text = event.text.text;
            }
          }
          else { // If we are on the title slide, set the title flag to true.
            output.title = true;
          }
          // Send the output to Python:
          Streamlit.setComponentValue(output);
        }
      });

      // This is just to set the height of the iframe after we have loaded the data. 
      Streamlit.setFrameHeight();

    } catch (error) {
      console.log('error making timeline...')
      console.error(error)
    }
  }
  Streamlit.setFrameHeight();
}

// Attach our `onRender` handler to Streamlit's render event.
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)

// Tell Streamlit we're ready to start receiving data.
Streamlit.setComponentReady()