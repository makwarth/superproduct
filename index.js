const superproduct = {

  attributes: function() {
    try {
      
      this.dispatchAttributes();
      setInterval(function() {
        superproduct.dispatchAttributes()
      }, window.superproduct.CONFIG.dispatchAtttributesInterval);

    } catch (err) {
      console.log(err);
    }
  },

  dispatchAttributes: function() {
    try {
      //are there any attributes to dispatch?
      if (Object.keys(window.superproduct.ATTRIBUTES_OBJ).length > 0) {
        //dispatch
        fetch(window.superproduct.CONFIG.dispatchUrlAttributes, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(window.superproduct.ATTRIBUTES_OBJ)
        })
          .then(function(result) {
            if (window.superproduct.CONFIG.debug)
              console.log("superproduct: Attributes dispatched");
          })
          .catch(function(error) {
            if (window.superproduct.CONFIG.debug)
              console.log("superproduct: Dispatch error: ", error);
          });
          
      } else {
        if (window.superproduct.CONFIG.debug)
          console.log("superproduct: No attributes to dispatch");
      }
    } catch(err) {
      console.log("superproduct: attribues dispatch error");
    }
  },

  event: function(eventStr, eventTagsObj) {
    try {
      
      if(!window.superproduct.EVENTS_OBJ.company) {
        console.log("superproduct: run identify first");
        return null;
      }
      
      //create event obj
      let eventObj = {
        event: eventStr
      };

      //add tags to obj if not empty
      //first, merge global and local tags
      const tags = { ...window.superproduct.GLOBAL_TAGS, ...eventTagsObj };

      //check if empty
      if (tags && typeof tags === "object" && Object.keys(tags).length > 0) {
        eventObj.tags = tags;
      }

      //push event to dispatch array
      window.superproduct.EVENTS_OBJ.events.push(eventObj);

    } catch (err) {
      if(!window.superproduct) {
        console.log("superproduct: run init first");
      } else {
        console.log("superproduct: error");
      }
    }
  },

  dispatchEvents: function() {
    try {
      if(!window.superproduct) return null;

      setInterval(function() {
        //copy current dispatch obj
        let dispatchObj = window.superproduct.EVENTS_OBJ;
        let dispatchObjEventsCount = dispatchObj.events.length;

        //are there any objects to dispatch?
        if (dispatchObjEventsCount > 0) {
          //dispatch
          fetch(window.superproduct.CONFIG.dispatchUrlEvents, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(dispatchObj)
          })
            .then(function(result) {
              //remove dispatched events from source object
              window.superproduct.EVENTS_OBJ.events.splice(0, dispatchObjEventsCount);

              if (window.superproduct.CONFIG.debug)
                console.log(
                  "superproduct: Dispatched " +
                    dispatchObjEventsCount +
                    " events"
                );
            })
            .catch(function(error) {
              if (window.superproduct.CONFIG.debug)
                console.log("superproduct: Dispatch error: ", error);
            });
        } else {
          if (window.superproduct.CONFIG.debug)
            console.log("superproduct: No events to dispatch");
        }

      }, window.superproduct.CONFIG.dispatchInterval);
    } catch (err) {
      console.log(err);
    }
  },

  init: function(config) {
    try {
      if(!window.superproduct) {
        //global object
        window.superproduct = {
          CONFIG: {},
          GLOBAL_TAGS: {},
          ATTRIBUTES_OBJ: {
            company: null,
            attributes: {}
          },
          EVENTS_OBJ: {
            company: null,
            events: []
          }
        }
      }

      //defaults
      const defs = {
        dispatchHost: "http://localhost:3200",
        //dispatchHost: "https://ingest.superproduct.io",
        dispatchUrlEventsSuffix: "events",
        dispatchUrlAttributesSuffix: "attributes",
        dispatchInterval: 1000,
        dispatchAtttributesInterval: 60000,
        debug: false
      };

      console.log("superproduct:", defs.dispatchHost);

      //optional user overwrites
      window.superproduct.CONFIG.dispatchInterval = defs.dispatchInterval;
      window.superproduct.CONFIG.dispatchAtttributesInterval = defs.dispatchAtttributesInterval;
      window.superproduct.CONFIG.debug = config.debug || defs.debug;

      //-account
      window.superproduct.CONFIG.dispatchUrlEvents =
        defs.dispatchHost + "/" + config.appId + "/" + defs.dispatchUrlEventsSuffix;
        window.superproduct.CONFIG.dispatchUrlAttributes =
        defs.dispatchHost + "/" + config.appId + "/" + defs.dispatchUrlAttributesSuffix;

    } catch(err) {
      console.log("superproduct: could not init")
    }

  },


  identify: function(attributes) {
    
    try {

      //-attributes
      window.superproduct.ATTRIBUTES_OBJ.company = attributes.company;
      window.superproduct.ATTRIBUTES_OBJ.attributes = attributes.attributes;
      superproduct.attributes();

      //-events
      //company
      window.superproduct.EVENTS_OBJ.company = attributes.company;

      //tags
      window.superproduct.GLOBAL_TAGS = attributes.tags;

      //start events background dispatcher
      superproduct.dispatchEvents();

    } catch(err) {
      
      if(!window.init) {
        console.log("superproduct: run init first")
      } else {
        console.log(err);
      }

    }
  }
};

export default superproduct;
