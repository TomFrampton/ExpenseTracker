using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Augustus.Api.Extensions
{
    public static class IQueryableExtensions
    {
        public static async Task<bool> NotAnyAsync<TSource>(this IQueryable<TSource> source, Expression<Func<TSource, bool>> predicate)
        {
            bool any = await source.AnyAsync(predicate);
            return !any;
        }

        public static async Task<IList<TResult>> SelectListAsync<TSource, TResult>(this IQueryable<TSource> source, Expression<Func<TSource, TResult>> selector)
        {
            return await source.Select(selector).ToListAsync();
        }
    }
}
