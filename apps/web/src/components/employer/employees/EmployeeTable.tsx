import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Mail, Ban, TrendingUp, Shield, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Employee } from "@/data/mockEmployees";

interface EmployeeTableProps {
  employees: Employee[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
}

export function EmployeeTable({ employees, selectedIds, onSelectAll, onSelectOne }: EmployeeTableProps) {
  const { toast } = useToast();
  const allSelected = employees.length > 0 && selectedIds.length === employees.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < employees.length;

  const getReliabilityBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-success/10 text-success">{score}%</Badge>;
    if (score >= 50) return <Badge className="bg-warning/10 text-warning">{score}%</Badge>;
    return <Badge className="bg-destructive/10 text-destructive">{score}%</Badge>;
  };

  const handleInvite = (employee: Employee) => {
    toast({ title: "Invite sent", description: `Invited ${employee.name} to a gig` });
  };

  const handleBlock = (employee: Employee) => {
    toast({ title: "Worker blocked", description: `${employee.name} has been blocked`, variant: "destructive" });
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  className={someSelected ? "data-[state=checked]:bg-primary" : ""}
                />
              </TableHead>
              <TableHead>Worker</TableHead>
              <TableHead className="text-center">Reliability</TableHead>
              <TableHead className="text-center">Total Gigs</TableHead>
              <TableHead>Last Worked</TableHead>
              <TableHead className="text-center">Badges</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  No workers found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-secondary/30 transition-colors">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(employee.id)}
                      onCheckedChange={(checked) => onSelectOne(employee.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarImage src={employee.photoUrl} alt={employee.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {employee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.hzlrId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      {getReliabilityBadge(employee.reliabilityScore)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{employee.totalGigs}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(employee.lastWorkedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {employee.groomingVerified && (
                        <span title="Grooming Certified">
                          <Sparkles className="w-4 h-4 text-info" />
                        </span>
                      )}
                      {employee.identityVerified && (
                        <span title="Identity Verified">
                          <Shield className="w-4 h-4 text-success" />
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{employee.preferredCategory}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/employer/employees/${employee.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleInvite(employee)}>
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleBlock(employee)}>
                        <Ban className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
