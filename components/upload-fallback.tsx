import { Card, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"

export function UploadFallback() {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Upload className="h-10 w-10 text-muted-foreground" />
            </div>

            <div className="flex flex-col space-y-2 text-center">
              <h3 className="text-lg font-semibold">Loading analyzer...</h3>
              <p className="text-sm text-muted-foreground">Please wait while we initialize the file analyzer</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}