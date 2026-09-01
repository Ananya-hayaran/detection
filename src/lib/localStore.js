import { generateId } from "./uuid.js";

const STORAGE_PREFIX = "medsense_demo_";

function getStorageKey(tableName) {
  return `${STORAGE_PREFIX}${tableName}`;
}

function isStorageAvailable() {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

export function readTable(tableName) {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(tableName));

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Failed to read demo table "${tableName}":`, error);
    return [];
  }
}

export function writeTable(tableName, rows) {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    window.localStorage.setItem(
      getStorageKey(tableName),
      JSON.stringify(rows)
    );
  } catch (error) {
    console.error(`Failed to write demo table "${tableName}":`, error);
  }
}

export function clearTable(tableName) {
  if (!isStorageAvailable()) {
    return;
  }

  window.localStorage.removeItem(getStorageKey(tableName));
}

export function clearAllDemoData() {
  if (!isStorageAvailable()) {
    return;
  }

  const keysToRemove = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (key?.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

export function insertRow(tableName, row) {
  const rows = readTable(tableName);

  const newRow = {
    id: row.id ?? generateId(),
    created_at: row.created_at ?? new Date().toISOString(),
    updated_at: row.updated_at ?? new Date().toISOString(),
    ...row,
  };

  rows.push(newRow);
  writeTable(tableName, rows);

  return newRow;
}

export function insertRows(tableName, newRows) {
  const rows = readTable(tableName);

  const preparedRows = newRows.map((row) => ({
    id: row.id ?? generateId(),
    created_at: row.created_at ?? new Date().toISOString(),
    updated_at: row.updated_at ?? new Date().toISOString(),
    ...row,
  }));

  writeTable(tableName, [...rows, ...preparedRows]);

  return preparedRows;
}

export function findRow(tableName, id) {
  const rows = readTable(tableName);

  return rows.find((row) => row.id === id) ?? null;
}

export function updateRow(tableName, id, updates) {
  const rows = readTable(tableName);

  const index = rows.findIndex((row) => row.id === id);

  if (index === -1) {
    return null;
  }

  const updatedRow = {
    ...rows[index],
    ...updates,
    id,
    updated_at: new Date().toISOString(),
  };

  rows[index] = updatedRow;
  writeTable(tableName, rows);

  return updatedRow;
}

export function deleteRow(tableName, id) {
  const rows = readTable(tableName);

  const filteredRows = rows.filter((row) => row.id !== id);

  if (filteredRows.length === rows.length) {
    return false;
  }

  writeTable(tableName, filteredRows);

  return true;
}

export function queryRows(tableName, predicate) {
  const rows = readTable(tableName);

  return rows.filter(predicate);
}