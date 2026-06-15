// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { firebaseFeedbackRepo } from '../../services/firebaseAdapters';
import { FeedbackData } from '../../types';

const mockFeedback: FeedbackData = {
  rating: 5,
  comment: 'great',
  timestamp: null,
  results: { autonomy: 4, competence: 3.5, relatedness: 4.5 },
};

// ─── In-memory Firestore double ───────────────────────────────────────────────

type StoredDoc = Record<string, any>;

function makeFirestore() {
  const collections: Record<string, StoredDoc[]> = {};

  const getCol = (name: string) => {
    if (!collections[name]) collections[name] = [];
    return collections[name];
  };

  return {
    _collections: collections,
    collection: (name: string) => ({
      add: vi.fn(async (doc: StoredDoc) => {
        const id = `doc${getCol(name).length}`;
        getCol(name).push({ ...doc, _id: id });
        return { id };
      }),
      orderBy: () => ({
        get: vi.fn(async () => ({
          docs: getCol(name).map(d => ({ id: d._id, data: () => d })),
        })),
      }),
      doc: (id: string) => ({
        update: vi.fn(async (data: StoredDoc) => {
          const entry = getCol(name).find(d => d._id === id);
          if (entry) Object.assign(entry, data);
        }),
      }),
    }),
  };
}

function makeFirebaseMock(overrides: { currentUser?: any } = {}) {
  const firestoreInstance = makeFirestore();
  const firestoreStatic = Object.assign(
    () => firestoreInstance,
    { FieldValue: { serverTimestamp: () => 'TIMESTAMP' } }
  );
  return {
    apps: [{}],
    auth: () => ({ currentUser: overrides.currentUser ?? null }),
    firestore: firestoreStatic,
    _firestore: firestoreInstance,
  };
}

let fb: ReturnType<typeof makeFirebaseMock>;

beforeEach(() => {
  vi.unstubAllGlobals();
  fb = makeFirebaseMock({ currentUser: { uid: 'user-123', email: 'user@example.com' } });
  vi.stubGlobal('firebase', fb);
});

// ─── saveFeedback ─────────────────────────────────────────────────────────────

describe('saveFeedback', () => {
  it('reads currentUser when no userId param is given', async () => {
    await firebaseFeedbackRepo.saveFeedback(mockFeedback);
    const docs = fb._firestore._collections['feedback'];
    expect(docs).toHaveLength(1);
    expect(docs[0].userId).toBe('user-123');
  });

  it('uses explicit userId when provided, skipping currentUser', async () => {
    await firebaseFeedbackRepo.saveFeedback(mockFeedback, 'override-uid');
    const docs = fb._firestore._collections['feedback'];
    expect(docs[0].userId).toBe('override-uid');
  });

  it('resolves without throwing when Firebase not ready', async () => {
    vi.stubGlobal('firebase', { apps: [] });
    await expect(firebaseFeedbackRepo.saveFeedback(mockFeedback)).resolves.toBeUndefined();
  });
});

// ─── listFeedbacks ────────────────────────────────────────────────────────────

describe('listFeedbacks', () => {
  it('returns items from the feedback collection', async () => {
    fb._firestore._collections['feedback'] = [
      { _id: 'doc0', feedbackText: 'good', read: false },
      { _id: 'doc1', feedbackText: 'ok', read: true },
    ];
    const result = await firebaseFeedbackRepo.listFeedbacks();
    expect(result).toHaveLength(2);
    expect(result[0].feedbackText).toBe('good');
  });

  it('returns empty array when Firebase not ready', async () => {
    vi.stubGlobal('firebase', { apps: [] });
    const result = await firebaseFeedbackRepo.listFeedbacks();
    expect(result).toEqual([]);
  });
});

// ─── updateFeedbackRead ───────────────────────────────────────────────────────

describe('updateFeedbackRead', () => {
  it('updates the read field on the target document', async () => {
    fb._firestore._collections['feedback'] = [{ _id: 'doc0', read: false }];
    await firebaseFeedbackRepo.updateFeedbackRead('doc0', true);
    expect(fb._firestore._collections['feedback'][0].read).toBe(true);
  });

  it('resolves without throwing when Firebase not ready', async () => {
    vi.stubGlobal('firebase', { apps: [] });
    await expect(firebaseFeedbackRepo.updateFeedbackRead('x', true)).resolves.toBeUndefined();
  });
});
