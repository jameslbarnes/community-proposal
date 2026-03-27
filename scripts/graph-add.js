#!/usr/bin/env node

/**
 * graph-add.js — CLI helper for managing graph.json
 *
 * Usage:
 *   node scripts/graph-add.js add-node <json>
 *   node scripts/graph-add.js add-edge <json>
 *   node scripts/graph-add.js update-node <id> <json-patch>
 *   node scripts/graph-add.js remove-node <id>
 *   node scripts/graph-add.js remove-edge <source> <target> [type]
 *   node scripts/graph-add.js list-nodes [type]
 *   node scripts/graph-add.js list-edges [type]
 *   node scripts/graph-add.js check-id <id>
 *
 * Nodes are inserted in type-grouped order:
 *   pillar → person → organization → event → theme → place → resource
 *
 * Examples:
 *   node scripts/graph-add.js add-node '{"id":"pl-mindfulness","type":"pillar","label":"Mindfulness","description":"Weekly guided sessions.","x":0,"y":0}'
 *   node scripts/graph-add.js add-edge '{"source":"pl-mindfulness","target":"p-smith","type":"led_by","layer":"narrative","weight":7}'
 *   node scripts/graph-add.js update-node pl-mindfulness '{"description":"New description here"}'
 *   node scripts/graph-add.js check-id pl-mindfulness
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GRAPH_PATH = resolve(__dirname, '..', 'src', 'data', 'graph.json');

// Node type ordering for insertion
const NODE_TYPE_ORDER = ['pillar', 'person', 'organization', 'event', 'theme', 'place', 'resource'];

// Required fields per node type
const NODE_REQUIRED_FIELDS = {
  pillar: ['id', 'type', 'label', 'description', 'x', 'y'],
  person: ['id', 'type', 'label', 'description', 'x', 'y'],
  organization: ['id', 'type', 'label', 'description', 'x', 'y'],
  event: ['id', 'type', 'label', 'description', 'x', 'y'],
  theme: ['id', 'type', 'label', 'description', 'x', 'y'],
  place: ['id', 'type', 'label', 'description', 'x', 'y'],
  resource: ['id', 'type', 'label', 'description', 'x', 'y'],
};

// ID prefix conventions
const TYPE_PREFIX = {
  pillar: 'pl-',
  person: 'p-',
  organization: 'o-',
  event: 'e-',
  theme: 't-',
  place: 'l-',
  resource: 'r-',
};

const EDGE_REQUIRED_FIELDS = ['source', 'target', 'type', 'layer', 'weight'];

function loadGraph() {
  const raw = readFileSync(GRAPH_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveGraph(graph) {
  const json = JSON.stringify(graph, null, 2);
  writeFileSync(GRAPH_PATH, json + '\n', 'utf-8');
}

function validateNode(node) {
  if (!node.type || !NODE_TYPE_ORDER.includes(node.type)) {
    return `Invalid node type: "${node.type}". Must be one of: ${NODE_TYPE_ORDER.join(', ')}`;
  }
  const required = NODE_REQUIRED_FIELDS[node.type];
  const missing = required.filter(f => !(f in node));
  if (missing.length > 0) {
    return `Missing required fields for ${node.type}: ${missing.join(', ')}`;
  }
  const expectedPrefix = TYPE_PREFIX[node.type];
  if (expectedPrefix && !node.id.startsWith(expectedPrefix)) {
    return `ID "${node.id}" should start with "${expectedPrefix}" for type "${node.type}"`;
  }
  return null;
}

function validateEdge(edge) {
  const missing = EDGE_REQUIRED_FIELDS.filter(f => !(f in edge));
  if (missing.length > 0) {
    return `Missing required edge fields: ${missing.join(', ')}`;
  }
  return null;
}

function findInsertionIndex(nodes, newNode) {
  const targetTypeIndex = NODE_TYPE_ORDER.indexOf(newNode.type);

  // Find the last node of the same type, insert after it
  let lastSameType = -1;
  for (let i = nodes.length - 1; i >= 0; i--) {
    if (nodes[i].type === newNode.type) {
      lastSameType = i;
      break;
    }
  }
  if (lastSameType !== -1) return lastSameType + 1;

  // No nodes of this type exist yet — find where this type group should go
  for (let i = 0; i < nodes.length; i++) {
    const nodeTypeIndex = NODE_TYPE_ORDER.indexOf(nodes[i].type);
    if (nodeTypeIndex > targetTypeIndex) return i;
  }

  return nodes.length;
}

function findEdgeInsertionIndex(edges) {
  return edges.length;
}

// ── Commands ──

function addNode(jsonStr) {
  const node = JSON.parse(jsonStr);
  const graph = loadGraph();

  if (graph.nodes.some(n => n.id === node.id)) {
    console.error(`ERROR: Node "${node.id}" already exists. Use update-node to modify it.`);
    process.exit(1);
  }

  const err = validateNode(node);
  if (err) {
    console.error(`ERROR: ${err}`);
    process.exit(1);
  }

  if (node.x === undefined) node.x = 0;
  if (node.y === undefined) node.y = 0;

  const idx = findInsertionIndex(graph.nodes, node);
  graph.nodes.splice(idx, 0, node);
  saveGraph(graph);
  console.log(`Added ${node.type} node "${node.id}" (${node.label}) at index ${idx}`);
  console.log(`Graph now has ${graph.nodes.length} nodes`);
}

function addEdge(jsonStr) {
  const edge = JSON.parse(jsonStr);
  const graph = loadGraph();

  const err = validateEdge(edge);
  if (err) {
    console.error(`ERROR: ${err}`);
    process.exit(1);
  }

  if (!graph.nodes.some(n => n.id === edge.source)) {
    console.error(`WARNING: Source node "${edge.source}" not found in graph`);
  }
  if (!graph.nodes.some(n => n.id === edge.target)) {
    console.error(`WARNING: Target node "${edge.target}" not found in graph`);
  }

  const dup = graph.edges.find(e =>
    e.source === edge.source && e.target === edge.target && e.type === edge.type
  );
  if (dup) {
    console.error(`ERROR: Edge ${edge.source} → ${edge.target} (${edge.type}) already exists`);
    process.exit(1);
  }

  const idx = findEdgeInsertionIndex(graph.edges);
  graph.edges.splice(idx, 0, edge);
  saveGraph(graph);
  console.log(`Added edge: ${edge.source} → ${edge.target} (${edge.type}, layer:${edge.layer}, weight:${edge.weight})`);
  console.log(`Graph now has ${graph.edges.length} edges`);
}

function updateNode(id, patchStr) {
  const patch = JSON.parse(patchStr);
  const graph = loadGraph();

  const node = graph.nodes.find(n => n.id === id);
  if (!node) {
    console.error(`ERROR: Node "${id}" not found`);
    process.exit(1);
  }

  delete patch.id;
  delete patch.type;

  const changed = [];
  for (const [key, value] of Object.entries(patch)) {
    const old = node[key];
    node[key] = value;
    changed.push(key);
    if (key === 'description') {
      console.log(`  ${key}: "${String(old).slice(0, 60)}..." → "${String(value).slice(0, 60)}..."`);
    } else {
      console.log(`  ${key}: ${JSON.stringify(old)} → ${JSON.stringify(value)}`);
    }
  }

  saveGraph(graph);
  console.log(`Updated node "${id}": changed ${changed.join(', ')}`);
}

function removeNode(id) {
  const graph = loadGraph();

  const idx = graph.nodes.findIndex(n => n.id === id);
  if (idx === -1) {
    console.error(`ERROR: Node "${id}" not found`);
    process.exit(1);
  }

  const node = graph.nodes[idx];
  graph.nodes.splice(idx, 1);

  const edgesBefore = graph.edges.length;
  graph.edges = graph.edges.filter(e => e.source !== id && e.target !== id);
  const edgesRemoved = edgesBefore - graph.edges.length;

  saveGraph(graph);
  console.log(`Removed node "${id}" (${node.label})`);
  console.log(`Removed ${edgesRemoved} connected edges`);
  console.log(`Graph now has ${graph.nodes.length} nodes, ${graph.edges.length} edges`);
}

function removeEdge(source, target, type) {
  const graph = loadGraph();

  const idx = graph.edges.findIndex(e =>
    e.source === source && e.target === target && (!type || e.type === type)
  );
  if (idx === -1) {
    console.error(`ERROR: Edge ${source} → ${target}${type ? ` (${type})` : ''} not found`);
    process.exit(1);
  }

  const edge = graph.edges[idx];
  graph.edges.splice(idx, 1);
  saveGraph(graph);
  console.log(`Removed edge: ${edge.source} → ${edge.target} (${edge.type})`);
  console.log(`Graph now has ${graph.edges.length} edges`);
}

function listNodes(type) {
  const graph = loadGraph();
  let nodes = graph.nodes;
  if (type) nodes = nodes.filter(n => n.type === type);

  console.log(`${nodes.length} nodes${type ? ` of type "${type}"` : ''}:\n`);
  for (const n of nodes) {
    const desc = n.description ? ` — ${n.description.slice(0, 80)}${n.description.length > 80 ? '...' : ''}` : '';
    console.log(`  ${n.id} (${n.type}): ${n.label}${desc}`);
  }
}

function listEdges(type) {
  const graph = loadGraph();
  let edges = graph.edges;
  if (type) edges = edges.filter(e => e.type === type);

  console.log(`${edges.length} edges${type ? ` of type "${type}"` : ''}:\n`);
  for (const e of edges) {
    console.log(`  ${e.source} → ${e.target} (${e.type}, ${e.layer}, w:${e.weight})`);
  }
}

function checkId(id) {
  const graph = loadGraph();

  const node = graph.nodes.find(n => n.id === id);
  if (node) {
    console.log(`FOUND: ${node.id} (${node.type}): ${node.label}`);
    if (node.description) console.log(`  Description: ${node.description}`);

    const edges = graph.edges.filter(e => e.source === id || e.target === id);
    if (edges.length > 0) {
      console.log(`  ${edges.length} connected edges:`);
      for (const e of edges) {
        const other = e.source === id ? e.target : e.source;
        const dir = e.source === id ? '→' : '←';
        console.log(`    ${dir} ${other} (${e.type}, ${e.layer}, w:${e.weight})`);
      }
    }
  } else {
    console.log(`NOT FOUND: "${id}" does not exist in graph`);

    const prefix = id.split('-')[0] + '-';
    const similar = graph.nodes
      .filter(n => n.id.startsWith(prefix))
      .map(n => n.id);
    if (similar.length > 0) {
      console.log(`  Similar IDs: ${similar.slice(0, 10).join(', ')}${similar.length > 10 ? '...' : ''}`);
    }
  }
}

// ── CLI entry ──

const [,, command, ...args] = process.argv;

switch (command) {
  case 'add-node':
    if (!args[0]) { console.error('Usage: graph-add.js add-node <json>'); process.exit(1); }
    addNode(args[0]);
    break;
  case 'add-edge':
    if (!args[0]) { console.error('Usage: graph-add.js add-edge <json>'); process.exit(1); }
    addEdge(args[0]);
    break;
  case 'update-node':
    if (!args[0] || !args[1]) { console.error('Usage: graph-add.js update-node <id> <json-patch>'); process.exit(1); }
    updateNode(args[0], args[1]);
    break;
  case 'remove-node':
    if (!args[0]) { console.error('Usage: graph-add.js remove-node <id>'); process.exit(1); }
    removeNode(args[0]);
    break;
  case 'remove-edge':
    if (!args[0] || !args[1]) { console.error('Usage: graph-add.js remove-edge <source> <target> [type]'); process.exit(1); }
    removeEdge(args[0], args[1], args[2]);
    break;
  case 'list-nodes':
    listNodes(args[0]);
    break;
  case 'list-edges':
    listEdges(args[0]);
    break;
  case 'check-id':
    if (!args[0]) { console.error('Usage: graph-add.js check-id <id>'); process.exit(1); }
    checkId(args[0]);
    break;
  default:
    console.log(`graph-add.js — CLI helper for managing graph.json

Commands:
  add-node <json>                Add a new node
  add-edge <json>                Add a new edge
  update-node <id> <json-patch>  Update fields on an existing node
  remove-node <id>               Remove a node and its edges
  remove-edge <src> <tgt> [type] Remove an edge
  list-nodes [type]              List all nodes (optionally filtered by type)
  list-edges [type]              List all edges (optionally filtered by type)
  check-id <id>                  Check if an ID exists and show its connections`);
    break;
}
