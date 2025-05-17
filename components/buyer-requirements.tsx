import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Wallet, Maximize2, Star } from "lucide-react"

interface BuyerRequirementsProps {
  requirements: {
    budget: string
    location: string
    size: string
    features: string[]
    preferences: string[]
  }
}

export function BuyerRequirements({ requirements }: BuyerRequirementsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{requirements.budget}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{requirements.location}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize2 className="h-5 w-5" />
            Size Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{requirements.size}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Must-Have Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {requirements.features.map((feature, index) => (
              <Badge key={index} variant="secondary">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Additional Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {requirements.preferences.map((preference, index) => (
              <Badge key={index} variant="outline">
                {preference}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}