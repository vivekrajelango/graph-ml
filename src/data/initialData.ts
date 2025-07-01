export const sampleGraphML = `<?xml version='1.0' encoding='utf-8'?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
<key id="labels" for="edge" attr.name="labels" attr.type="string"/>
<key id="labels" for="node" attr.name="labels" attr.type="string"/>
<graph edgedefault="directed">
<node id="researcher-1"><data key="labels">Researcher</data></node>
<node id="researcher-2"><data key="labels">Researcher</data></node>
<node id="researcher-3"><data key="labels">Researcher</data></node>
<node id="researcher-4"><data key="labels">Researcher</data></node>
<node id="researcher-5"><data key="labels">Researcher</data></node>
<node id="researcher-6"><data key="labels">Researcher</data></node>
<node id="researcher-7"><data key="labels">Researcher</data></node>
<node id="researcher-8"><data key="labels">Researcher</data></node>
<node id="pub-1"><data key="labels">BookPublication</data></node>
<node id="pub-2"><data key="labels">BookPublication</data></node>
<node id="pub-3"><data key="labels">BookPublication</data></node>
<node id="publisher-1"><data key="labels">Publisher</data></node>
<node id="institution-1"><data key="labels">Institution</data></node>
<edge source="researcher-1" target="researcher-2"/>
<edge source="researcher-1" target="researcher-3"/>
<edge source="researcher-2" target="researcher-4"/>
<edge source="researcher-3" target="researcher-5"/>
<edge source="researcher-4" target="researcher-6"/>
<edge source="researcher-5" target="researcher-7"/>
<edge source="researcher-6" target="researcher-8"/>
<edge source="researcher-1" target="pub-1"/>
<edge source="researcher-2" target="pub-2"/>
<edge source="researcher-3" target="pub-3"/>
<edge source="pub-1" target="publisher-1"/>
<edge source="pub-2" target="publisher-1"/>
<edge source="researcher-1" target="institution-1"/>
<edge source="researcher-2" target="institution-1"/>
<edge source="researcher-7" target="researcher-1"/>
<edge source="researcher-8" target="researcher-4"/>
</graph>
</graphml>`;