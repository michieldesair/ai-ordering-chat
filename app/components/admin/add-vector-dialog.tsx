import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { BadgePlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { types } from '@/data/data';
import { Textarea } from '@/components/ui/textarea';
import { addDocument } from '@/lib/add-document';

export function AddVector() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <BadgePlus />
          Nieuwe vector
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <form action={addDocument}>
          <DialogHeader>
            <DialogTitle>Vector Toevoegen</DialogTitle>
            {/* <DialogDescription>lorem ipsum</DialogDescription> */}
          </DialogHeader>
          <Tabs defaultValue={types[0].value}>
            <TabsList>
              {types.map((type) => (
                <TabsTrigger key={type.value} value={type.value}>
                  {type.label}
                </TabsTrigger>
              ))}{' '}
            </TabsList>
            {types.map((type) => (
              <TabsContent key={type.value} value={type.value}>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="text_conten">Vector Omschrijving</Label>
                    <Textarea
                      name="content"
                      placeholder={`Duidelijke text omschrijving voor '${type.label}'`}
                      className="min-h-24 bg-muted"
                      spellCheck={false}
                    />
                  </Field>
                </FieldGroup>
              </TabsContent>
            ))}
          </Tabs>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annulleer</Button>
            </DialogClose>
            <Button type="submit" className="hover:text-cursor">
              Process
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
