import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { owaspTen } from "@/data/owasp-ten";

export function OwaspTenAccordion() {
  const renderedList = owaspTen.map((item) => {
    return (
      <AccordionItem
        value={`item-${item.id}`}
        key={item.id}
        className="border-border"
      >
        <AccordionTrigger className="text-foreground hover:text-primary">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          {item.description}
        </AccordionContent>
      </AccordionItem>
    );
  });

  return (
    <Accordion type="single" collapsible className="w-full">
      {renderedList}
    </Accordion>
  );
}
