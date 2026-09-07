import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>StackForge</CardTitle>
          <CardDescription>
            Kod yazmadan, sürükle-bırak ile oyun sistemi üretimi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Başla</Button>
        </CardContent>
      </Card>
    </main>
  )
}
