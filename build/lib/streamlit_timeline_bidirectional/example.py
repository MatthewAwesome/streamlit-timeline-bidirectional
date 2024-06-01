import streamlit as st
from streamlit_timeline_bidirectional import st_timeline_bidirectional
import json

# Add some test code to y with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run my_component/example.py`

# Let's load the example.json as a dict: 
with open("example.json") as f:
    data = json.load(f)

# Let's do a config to make the page width a bit wider.
st.set_page_config(layout="wide")

# Initialize session state: 
st.session_state.setdefault("st_timeline_bidirectional", {})

if st.session_state.st_timeline_bidirectional != {}:
    print(st.session_state.st_timeline_bidirectional)

component_data = {'data': data, 'startIndex':0}
# We 
value = st_timeline_bidirectional(component_data,800,key="st_timeline_bidirectional")


    



