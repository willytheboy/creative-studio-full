'use client'

type AssetRecord = {
  id: string
  blob?: Blob
  objectUrl?: string
  imageBitmap?: ImageBitmap
  width?: number
  height?: number
  lastAccessedAt: number
}

class AssetCache {
  private records = new Map<string, AssetRecord>()

  async addBlob(id: string, blob: Blob) {
    this.revoke(id)
    const objectUrl = URL.createObjectURL(blob)
    let imageBitmap: ImageBitmap | undefined
    try { imageBitmap = await createImageBitmap(blob) } catch {}
    const record: AssetRecord = { id, blob, objectUrl, imageBitmap, width: imageBitmap?.width, height: imageBitmap?.height, lastAccessedAt: Date.now() }
    this.records.set(id, record)
    return record
  }

  get(id: string) {
    const record = this.records.get(id)
    if (record) record.lastAccessedAt = Date.now()
    return record
  }

  revoke(id: string) {
    const record = this.records.get(id)
    if (!record) return
    if (record.objectUrl) URL.revokeObjectURL(record.objectUrl)
    if (record.imageBitmap) record.imageBitmap.close()
    this.records.delete(id)
  }

  clear() {
    for (const id of this.records.keys()) this.revoke(id)
  }
}

export const assetCache = new AssetCache()
