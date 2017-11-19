import cs from '../constants/params';
import moment from 'moment';
import {
  efResultDelegate
}
from './delegates';
const initialState = {

  // fetches from redis go here
  everything: {
    active: false,
    ready: false,
    error: "",
    commentary: "",
    data: {},
    slotData: [],
    things: {

    }
  },

  // and end up here
  pageResults: {
    stats: {}
  },

  ranges: {
    start: moment().subtract(6, "days").startOf('day').toDate(),
    finish: moment().endOf('day').toDate(),
    period: 'day',
    slots: []
  }

};

export default function(state = initialState, action) {


  // things I can deal with
  const acts = [
    cs.actions.FETCH_STATS
  ];


  const newState = efResultDelegate(action, acts, state, initialState);
  if (newState) {
    // doiing a bit more tweaking if we're fetching stats
    if (action.type === cs.actions.FETCH_STATS + "_FULFILLED") {
      // convert to kb
      const data = state.pageResults[action.payload.pageResults].data;
      if (data && data.value && data.value.rows) {
        const columns = data.value.columns;
        data.chunks = data.value.rows.map((d) => {
          
          // objectize the row
          const nd = d.reduce ((p,c,i)=> {
            p[columns[i]] = c;
            return p;
          }, {} );
          
          // bucketize
          nd.setsize = nd.method === "set" ? nd.size/1024 : 0;
          nd.getsize = nd.method === "get" ? nd.size/1024 : 0;
          nd.set = nd.method === "set" ? nd.count : 0;
          nd.get = nd.method === "get" ? nd.count : 0;
          nd.remove = nd.method === "remove" ? nd.count : 0;
          
          return nd;
        });
      }
      else {
        data.chunks = [];
      }

      applySlots(newState);
    }
    return newState;
  }


  // non standard things
  switch (action.type) {

    // record which accounts are currently selected
    case cs.actions.STATS_SELECTED_ROWS:
      {
        state = { ...state
        };
        state.pageResults[action.payload.pageResults].selectedItems = action.payload.selectedItems;

        return state;
      }

    case cs.actions.GENERATE_SLOTS:
      {
        state = { ...state};
        state.ranges.slots = generateSlots(state);
        applySlots(state);
        return state;
      }

    case cs.actions.RANGE_START:
      {
        state = { ...state};
        state.ranges.start = action.payload;
        state.ranges.slots = generateSlots(state);
        return state;
      }

    case cs.actions.RANGE_FINISH:
      {
        state = { ...state
        };
        state.ranges.finish = action.payload;
        state.ranges.slots = generateSlots(state);
        return state;
      }

    case cs.actions.RANGE_PERIOD:
      {
        state = { ...state
        };
        state.ranges.period = action.payload;
        state.ranges.slots = generateSlots(state);
        applySlots(state);
        return state;
      }

    case cs.actions.STATS_RESULT_CLEAR:
      {
        return { ...state, pageResults: { ...initialState.pageResults } };
      }

  }
  return state;

  function applySlots(state) {

    const place = state.pageResults['stats'];

    if (!state.ranges.slots || !place.data || !place.data.chunks) return null;

    // filter out unselected keys & scale to kb
    const selectedItems = place.selectedItems;
    const filtered = place.data.chunks
      .filter(d => !selectedItems || selectedItems.indexOf(d.coupon) !== -1);


    // spread the stats across the slots
    place.slotData = state.ranges.slots.map(d => {
      return filtered.reduce((p, c) => {
        if (c.slot >= d.startSlot && c.slot + c.floorWidth <= d.finishSlot) {
          ['setsize', 'getsize', 'set', 'get', 'remove'].forEach(e => {
            p[e] += (c[e] || 0);
          });
        }
        return p;
      }, {
        start: d.startSlot,
        set: 0,
        get: 0,
        getsize: 0,
        setsize: 0,
        remove: 0
      });
    });

  }

  function generateSlots(state) {
    /**
     * generates an array of slots with the accuracy needed for the measurement period
     */


    const start = state.ranges.start.getTime();
    const finish = state.ranges.finish.getTime();

    let slots = [];
    for (let s = start; finish > s;) {
      slots.push({
        startSlot: s,
        finishSlot: (s = nextSlot_(s)) - 1
      });
    }
    return slots;

    function nextSlot_(point) {
      return moment(point).add(1, state.ranges.period).toDate().getTime();
    }

  }

}
