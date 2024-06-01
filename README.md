# streamlit-custom-component

Streamlit component for making timelines that permit 
bidirectional exchanges of data. 

The project relies upon Knight Lab's TimelineJS project. 

## Installation instructions

```sh
pip install streamlit-custom-component
```

## Usage instructions

```python
import streamlit as st

from streamlit_timeline_bidirectional import st_timeline_bidirectional

value = st_timeline_bidirectional(data,height=600)

# value is a dictionary corresponding to the event 
# currently shown on the timeline. 

```