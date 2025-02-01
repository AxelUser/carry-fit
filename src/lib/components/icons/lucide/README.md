# Why not use Lucide Icons from lucide-svelte library?

## Performance

The icons in this directory are extracted from the lucide-svelte library rather than using the dependency directly. This is done for performance optimization reasons, which is crucial for large and dynamic tables.

## Why you are still using lucide-svelte?

The lucide-svelte library is used in places that are not performance critical, such as the header of the table, inputs, etc.
