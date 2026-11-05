'use client'

import { useEffect, useRef, useState } from 'react'
import type { ContractSignature } from '@/domain/documents/contract.types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeaderIcon,
  DialogTitle,
} from '@/components/ui/dialog'
import { PenLine } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SignatureCaptureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  signatoryName: string
  onConfirm: (signature: ContractSignature) => void
}

export function SignatureCaptureDialog ({
  open,
  onOpenChange,
  signatoryName,
  onConfirm,
}: SignatureCaptureDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [typedValue, setTypedValue] = useState(signatoryName)
  const [mode, setMode] = useState<'typed' | 'drawn'>('typed')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !open) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#242424'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
  }, [open, mode])

  function pointerPos (
    event: React.PointerEvent<HTMLCanvasElement>
  ): { x: number; y: number } {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  function handlePointerDown (event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    drawing.current = true
    canvas.setPointerCapture(event.pointerId)
    const { x, y } = pointerPos(event)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function handlePointerMove (event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const { x, y } = pointerPos(event)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function handlePointerUp (event: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = false
    canvasRef.current?.releasePointerCapture(event.pointerId)
  }

  function clearCanvas () {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  function handleConfirm () {
    if (mode === 'typed') {
      const value = typedValue.trim()
      if (!value) return
      onConfirm({ kind: 'typed', value })
      onOpenChange(false)
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    onConfirm({ kind: 'drawn', value: canvas.toDataURL('image/png') })
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setTypedValue(signatoryName)
          setMode('typed')
        }
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogHeaderIcon>
            <PenLine className="size-4 text-text-secondary" aria-hidden />
          </DialogHeaderIcon>
          <DialogTitle>Sign as {signatoryName}</DialogTitle>
          <DialogDescription>
            Type your name or draw your signature. This is stored for the prototype session only.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as 'typed' | 'drawn')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="typed">Type</TabsTrigger>
            <TabsTrigger value="drawn">Draw</TabsTrigger>
          </TabsList>
          <TabsContent value="typed" className="space-y-2">
            <label className="text-sm font-medium text-text-primary" htmlFor="typed-signature">
              Signature text
            </label>
            <Input
              id="typed-signature"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="drawn" className="space-y-2">
            <canvas
              ref={canvasRef}
              width={440}
              height={160}
              className="w-full touch-none rounded-lg border border-border bg-white"
              aria-label="Draw signature"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
            <Button type="button" variant="outline" size="sm" onClick={clearCanvas}>
              Clear drawing
            </Button>
          </TabsContent>
        </Tabs>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="brand" onClick={handleConfirm}>
            Apply signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
