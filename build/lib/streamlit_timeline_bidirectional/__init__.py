import os
import streamlit.components.v1 as components

"""
This module provides a Streamlit custom component to display a timeline. 

The term bidirectional refers to the data flow between the component and the Streamlit app.

```python
import streamlit_timeline_bidirectional as stb

# Display a bidirectional timeline with default settings.
data = {data:..., startIndex:...}
value = stb.st_timeline_bidirectional(data)
```
"""

# Local or web? 
_RELEASE = False

# We work locally with an NPM dev server during development if release if False.
if not _RELEASE:
    _component_func = components.declare_component(
        # This is the name of the NPM package linked to this component.
        "streamlit_timeline_bidirectional",
        # The url is the local server that provides the component files.``
        url="http://localhost:3001",
    )
# Else, we work with the production build of the component.
else:
    # This will, for example, live in a folder named `frontend/build` in the same directory as this file.
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("streamlit_timeline_bidirectional", path=build_dir)


# Wrapper function for the timeline component.
def st_timeline_bidirectional(data: dict, height: int, key=None):
    """Create a new instance of "streamlit_timeline_bidirectional".

    Parameters
    ----------
    data: dict
        A dictionary with the following keys: 
            - data: dict - The data to display in the timeline, has events list and (optionally) title object.
            - startIndex: int - The index of the slide to start the timeline at.
    key: str or None
        An optional key that uniquely identifies this component. If this is
        None, and the component's arguments are changed, the component will
        be re-mounted in the Streamlit frontend and lose its current state.

    Returns
    -------
    dict
        A dictionary with the following keys
            - text: str - The text object of the timeline, i.e., 'text': {'headline': str, 'text': str}
            - last: bool - Whether the timeline is at the last slide.
            - title: bool - Whether the timeline has a title object and is currently displaying it.

    Notes
    -----
    The args are available in the frontend. E.g., 

            const data = (event as CustomEvent<RenderData>).detail;
            let timelineData = data.args["data"]; 
            let height = data.args["height"]; 
    
    where the RenderData event provides the access to the python vars. 
    """


    # "default" is a special argument that specifies the initial return
    # value of the component before the user has interacted with it.
    event_dict = _component_func(data=data,height=height,key=key, default={})

    # Return the event_dict. 
    return event_dict
