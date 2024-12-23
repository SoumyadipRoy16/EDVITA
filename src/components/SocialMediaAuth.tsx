import { Button } from "@/components/ui/button"
import { Github, Linkedin } from 'lucide-react'

type SocialMediaAuthProps = {
  action: 'Register' | 'Login'
}

export function SocialMediaAuth({ action }: SocialMediaAuthProps) {
  const handleGithubAuth = () => {
    // Implement GitHub authentication logic here
    console.log('GitHub auth')
  }

  const handleLinkedinAuth = () => {
    // Implement LinkedIn authentication logic here
    console.log('LinkedIn auth')
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">
        Or {action.toLowerCase()} with
      </p>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGithubAuth}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLinkedinAuth}
        >
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </Button>
      </div>
    </div>
  )
}