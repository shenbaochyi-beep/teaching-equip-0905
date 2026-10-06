import { ResourceItem, Reservation, SystemNotification } from '../types';

export interface ServerSyncPayload {
  version: number;
  lastUpdated: string;
  resources: ResourceItem[];
  reservations: Reservation[];
  notifications: SystemNotification[];
  customLogo: string | null;
}

// 獲取伺服器最新全域借用與設備資料庫
export async function fetchServerState(): Promise<ServerSyncPayload | null> {
  try {
    const res = await fetch('/api/state', {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.success && json.data) {
      return json.data as ServerSyncPayload;
    }
  } catch (err) {
    // 網路暫態或離線容錯
  }
  return null;
}

// 送出新借用預約至伺服器
export async function sendServerReservation(reservation: Reservation): Promise<boolean> {
  try {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservation })
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// 更新既有借用案狀態 (初審、主任核定、點交、歸還、延長等)
export async function sendServerReservationUpdate(id: string, updates: Partial<Reservation>): Promise<boolean> {
  try {
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// 鎖定並儲存實景照片至伺服器 (供全校同仁跨電腦同步查看)
export async function sendServerResourcePhoto(
  resourceId: string, 
  data: { imageUrl: string; photoLockedBy?: string; isPhotoLocked?: boolean }
): Promise<boolean> {
  try {
    const res = await fetch(`/api/resources/${resourceId}/photo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// 更新校徽至伺服器
export async function sendServerLogo(logo: string | null): Promise<boolean> {
  try {
    const res = await fetch('/api/logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logo })
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// 全局同步更新
export async function sendServerSync(payload: Partial<ServerSyncPayload>): Promise<boolean> {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// 重設範例資料
export async function sendServerReset(
  defaultReservations: Reservation[], 
  defaultNotifications: SystemNotification[]
): Promise<boolean> {
  try {
    const res = await fetch('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ defaultReservations, defaultNotifications })
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// 建立即時 Server-Sent Events 連線，任一電腦變更時即刻收到推播廣播
export function subscribeServerEvents(
  onData: (data: ServerSyncPayload) => void,
  onStatusChange?: (connected: boolean) => void
): () => void {
  let eventSource: EventSource | null = null;
  let retryTimer: any = null;
  let isClosed = false;

  function connect() {
    if (isClosed) return;
    try {
      eventSource = new EventSource('/api/events');

      eventSource.onopen = () => {
        onStatusChange?.(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && parsed.payload) {
            // payload 可能是完整 state 或包含 db
            const state = parsed.payload.db || parsed.payload;
            if (state && Array.isArray(state.resources) && Array.isArray(state.reservations)) {
              onData(state as ServerSyncPayload);
            }
          }
        } catch {
          // ignore parse error
        }
      };

      eventSource.onerror = () => {
        onStatusChange?.(false);
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        if (!isClosed) {
          retryTimer = setTimeout(connect, 3000);
        }
      };
    } catch {
      if (!isClosed) {
        retryTimer = setTimeout(connect, 4000);
      }
    }
  }

  connect();

  return () => {
    isClosed = true;
    if (retryTimer) clearTimeout(retryTimer);
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
}
